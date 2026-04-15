import React, { useState, useEffect, useCallback, useMemo } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AuthPage from "./components/AuthPage";
import StudentForm from "./components/StudentForm";
import StudentCard from "./components/StudentCard";
import Analytics from "./components/Analytics";
import api from "./services/api";
import "./App.css";

const PAGE_SIZE_OPTIONS = [6, 12, 24];

/* ─── Dashboard Component ─────────────────────────────── */
function Dashboard() {
  const { user, logout } = useAuth();
  const [students, setStudents] = useState([]);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [activeTab, setActiveTab] = useState("students"); // "students" | "analytics"

  // ── Filter state ─────────────────────────────────────
  const [search, setSearch] = useState("");
  const [filterBranch, setFilterBranch] = useState("All");
  const [filterYear, setFilterYear] = useState("All");
  const [filterSection, setFilterSection] = useState("All");
  const [cgpaMin, setCgpaMin] = useState("");
  const [cgpaMax, setCgpaMax] = useState("");

  // ── Sort state ───────────────────────────────────────
  const [sortKey, setSortKey] = useState("createdAt"); // name | rollNo | cgpa | createdAt
  const [sortDir, setSortDir] = useState("desc");       // asc | desc

  // ── Pagination state ─────────────────────────────────
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);

  // showToast - Displays a temporary notification at the bottom of the screen.
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // fetchStudents - Loads all students from the API.
  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.getAll();
      setStudents(res.data.data);
    } catch {
      showToast("Failed to fetch students", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  // Reset to page 1 whenever filters / sort change
  useEffect(() => { setPage(1); }, [search, filterBranch, filterYear, filterSection, cgpaMin, cgpaMax, sortKey, sortDir]);

  const handleCreate = async (data) => {
    try {
      await api.create(data);
      showToast("Student added successfully! 🎉");
      fetchStudents();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to add student", "error");
    }
  };

  const handleUpdate = async (data) => {
    try {
      await api.update(editData._id, data);
      showToast("Student updated successfully! ✅");
      setEditData(null);
      fetchStudents();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update student", "error");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(id);
      showToast("Student deleted successfully! 🗑️");
      setDeleteConfirm(null);
      fetchStudents();
    } catch {
      showToast("Failed to delete student", "error");
    }
  };

  // ── Derived data ──────────────────────────────────────
  const branches = useMemo(() => ["All", ...new Set(students.map((s) => s.branch))], [students]);
  const years    = useMemo(() => ["All", ...Array.from(new Set(students.map((s) => String(s.year)))).sort()], [students]);

  // Apply filters
  const filtered = useMemo(() => {
    const minC = cgpaMin !== "" ? parseFloat(cgpaMin) : null;
    const maxC = cgpaMax !== "" ? parseFloat(cgpaMax) : null;
    return students.filter((s) => {
      const q = search.toLowerCase();
      const matchSearch =
        s.name.toLowerCase().includes(q) ||
        s.rollNo.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q);
      const matchBranch   = filterBranch   === "All" || s.branch   === filterBranch;
      const matchYear     = filterYear     === "All" || String(s.year) === filterYear;
      const matchSection  = filterSection  === "All" || s.section  === filterSection;
      const matchCgpa =
        (minC === null || Number(s.cgpa) >= minC) &&
        (maxC === null || Number(s.cgpa) <= maxC);
      return matchSearch && matchBranch && matchYear && matchSection && matchCgpa;
    });
  }, [students, search, filterBranch, filterYear, filterSection, cgpaMin, cgpaMax]);

  // Apply sort
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let valA = a[sortKey];
      let valB = b[sortKey];
      if (sortKey === "cgpa") { valA = Number(valA); valB = Number(valB); }
      else if (sortKey === "rollNo" || sortKey === "name") {
        valA = String(valA).toLowerCase();
        valB = String(valB).toLowerCase();
      } else {
        // createdAt — already strings, compare as-is
        valA = String(valA);
        valB = String(valB);
      }
      if (valA < valB) return sortDir === "asc" ? -1 : 1;
      if (valA > valB) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [filtered, sortKey, sortDir]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paginated  = useMemo(() => sorted.slice((page - 1) * pageSize, page * pageSize), [sorted, page, pageSize]);

  // Toggle sort: same key → flip direction; new key → asc
  const handleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  const SortIcon = ({ col }) => {
    if (sortKey !== col) return <span className="sort-icon sort-neutral">↕</span>;
    return <span className="sort-icon sort-active">{sortDir === "asc" ? "↑" : "↓"}</span>;
  };

  const clearFilters = () => {
    setSearch(""); setFilterBranch("All"); setFilterYear("All");
    setFilterSection("All"); setCgpaMin(""); setCgpaMax("");
  };

  const hasActiveFilters = search || filterBranch !== "All" || filterYear !== "All" || filterSection !== "All" || cgpaMin !== "" || cgpaMax !== "";

  return (
    <div className="app">
      {/* Toast */}
      {toast && <div className={`toast toast-${toast.type}`}>{toast.message}</div>}

      {/* Delete modal */}
      {deleteConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-icon">🗑️</div>
            <h3>Delete Student</h3>
            <p>Are you sure you want to permanently remove this student? This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="btn-delete-confirm" onClick={() => handleDelete(deleteConfirm)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="app-header">
        <div className="header-inner">
          <div className="logo">
            <div className="logo-icon-wrap">🎓</div>
            <div>
              <h1>Student Manager</h1>
              <p>MERN CRUD — College Dashboard</p>
            </div>
          </div>

          {/* Nav tabs */}
          <nav className="header-nav">
            <button
              className={`nav-tab${activeTab === "students" ? " nav-tab-active" : ""}`}
              onClick={() => setActiveTab("students")}
            >📋 Students</button>
            <button
              className={`nav-tab${activeTab === "analytics" ? " nav-tab-active" : ""}`}
              onClick={() => setActiveTab("analytics")}
            >📊 Analytics</button>
          </nav>

          <div className="header-right">
            <div className="header-stats">
              <div className="stat-pill">
                <span className="stat-num">{students.length}</span>
                <span className="stat-label">Total</span>
              </div>
              <div className="stat-pill">
                <span className="stat-num">{filtered.length}</span>
                <span className="stat-label">Filtered</span>
              </div>
            </div>
            <div className="user-chip">
              <span className="user-avatar">{user?.name?.charAt(0).toUpperCase()}</span>
              <span className="user-name">{user?.name}</span>
              <button className="logout-btn" onClick={logout} title="Logout">Sign out</button>
            </div>
          </div>
        </div>
      </header>

      {activeTab === "analytics" ? (
        <main className="analytics-main">
          <Analytics students={students} />
        </main>
      ) : (
      <main className="main-content">
        {/* Form */}
        <section className="form-section">
          <StudentForm
            onSubmit={editData ? handleUpdate : handleCreate}
            editData={editData}
            onCancel={() => setEditData(null)}
          />
        </section>

        {/* Records */}
        <section className="list-section">
          <div className="list-header">
            <h2>Student Records</h2>

            {/* ── Search row ── */}
            <div className="controls">
              <div className="search-wrap">
                <span className="search-icon">🔍</span>
                <input
                  id="search-input"
                  type="text"
                  placeholder="Search by name, roll no or email…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>

            {/* ── Advanced filter row ── */}
            <div className="filter-row">
              {/* Branch */}
              <div className="filter-group">
                <label htmlFor="filter-branch">Branch</label>
                <select id="filter-branch" value={filterBranch} onChange={(e) => setFilterBranch(e.target.value)} className="filter-select">
                  {branches.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              {/* Section */}
              <div className="filter-group">
                <label htmlFor="filter-section">Section</label>
                <select id="filter-section" value={filterSection} onChange={(e) => setFilterSection(e.target.value)} className="filter-select">
                  <option value="All">All</option>
                  {["A", "B", "C", "D"].map((s) => <option key={s} value={s}>Section {s}</option>)}
                </select>
              </div>

              {/* Year */}
              <div className="filter-group">
                <label htmlFor="filter-year">Year</label>
                <select id="filter-year" value={filterYear} onChange={(e) => setFilterYear(e.target.value)} className="filter-select">
                  {years.map((y) => <option key={y} value={y}>{y === "All" ? "All Years" : `Year ${y}`}</option>)}
                </select>
              </div>

              {/* CGPA range */}
              <div className="filter-group">
                <label>CGPA Range</label>
                <div className="cgpa-range-inputs">
                  <input
                    id="cgpa-min"
                    type="number" min="0" max="10" step="0.1"
                    placeholder="Min"
                    value={cgpaMin}
                    onChange={(e) => setCgpaMin(e.target.value)}
                    className="cgpa-input"
                  />
                  <span className="cgpa-dash">–</span>
                  <input
                    id="cgpa-max"
                    type="number" min="0" max="10" step="0.1"
                    placeholder="Max"
                    value={cgpaMax}
                    onChange={(e) => setCgpaMax(e.target.value)}
                    className="cgpa-input"
                  />
                </div>
              </div>

              {/* Clear filters */}
              {hasActiveFilters && (
                <button className="btn-clear-filters" onClick={clearFilters} title="Clear all filters">
                  ✕ Clear
                </button>
              )}
            </div>

            {/* ── Sort bar ── */}
            <div className="sort-bar">
              <span className="sort-label">Sort by:</span>
              {[
                { key: "name",      label: "Name" },
                { key: "rollNo",    label: "Roll No" },
                { key: "cgpa",      label: "CGPA" },
                { key: "createdAt", label: "Added" },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  id={`sort-${key}`}
                  className={`sort-btn${sortKey === key ? " sort-btn-active" : ""}`}
                  onClick={() => handleSort(key)}
                >
                  {label} <SortIcon col={key} />
                </button>
              ))}

              {/* Page size */}
              <div className="page-size-wrap">
                <label htmlFor="page-size">Show</label>
                <select
                  id="page-size"
                  className="page-size-select"
                  value={pageSize}
                  onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                >
                  {PAGE_SIZE_OPTIONS.map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* ── Results ── */}
          {loading ? (
            <div className="loading-state">
              <div className="spinner" />
              <p>Fetching students…</p>
            </div>
          ) : paginated.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">{hasActiveFilters ? "🔍" : "📭"}</span>
              <p>{hasActiveFilters ? "No students match your filters." : "No students yet. Add one above!"}</p>
              {hasActiveFilters && <button className="btn-clear-filters" onClick={clearFilters}>Clear Filters</button>}
            </div>
          ) : (
            <>
              <div className="cards-grid">
                {paginated.map((student) => (
                  <StudentCard
                    key={student._id}
                    student={student}
                    onEdit={(s) => { setEditData(s); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    onDelete={(id) => setDeleteConfirm(id)}
                  />
                ))}
              </div>

              {/* ── Pagination controls ── */}
              <div className="pagination">
                <span className="pagination-info">
                  Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, sorted.length)} of {sorted.length}
                </span>
                <div className="pagination-btns">
                  <button
                    id="page-first"
                    className="page-btn"
                    onClick={() => setPage(1)}
                    disabled={page === 1}
                  >«</button>
                  <button
                    id="page-prev"
                    className="page-btn"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >‹</button>

                  {/* Page number pills */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                    .reduce((acc, p, idx, arr) => {
                      if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((item, idx) =>
                      item === "..." ? (
                        <span key={`ellipsis-${idx}`} className="page-ellipsis">…</span>
                      ) : (
                        <button
                          key={item}
                          id={`page-btn-${item}`}
                          className={`page-btn${page === item ? " page-btn-active" : ""}`}
                          onClick={() => setPage(item)}
                        >{item}</button>
                      )
                    )
                  }

                  <button
                    id="page-next"
                    className="page-btn"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >›</button>
                  <button
                    id="page-last"
                    className="page-btn"
                    onClick={() => setPage(totalPages)}
                    disabled={page === totalPages}
                  >»</button>
                </div>
              </div>
            </>
          )}
        </section>
      </main>
      )}
    </div>
  );
}

/* ─── AppContent ──────────────────────────────────────── */
function AppContent() {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="app-loading"><div className="spinner" /><span>Loading…</span></div>;
  return isAuthenticated ? <Dashboard /> : <AuthPage />;
}

/* ─── Root ────────────────────────────────────────────── */
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
