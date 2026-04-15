import React, { useMemo, useState } from "react";

/* ── helpers ──────────────────────────────────────────────── */
const avg   = (arr) => arr.length ? arr.reduce((s, v) => s + v, 0) / arr.length : 0;
const round2 = (n)  => Math.round(n * 100) / 100;

const GRADE_BANDS = [
  { label: "O  (≥9.0)", min: 9.0, max: 10.01, color: "#10b981" },
  { label: "A+ (≥8.0)", min: 8.0, max: 9.0,   color: "#6366f1" },
  { label: "A  (≥7.0)", min: 7.0, max: 8.0,   color: "#a78bfa" },
  { label: "B  (≥6.0)", min: 6.0, max: 7.0,   color: "#f59e0b" },
  { label: "C  (≥5.0)", min: 5.0, max: 6.0,   color: "#f97316" },
  { label: "F  (<5.0)", min: 0,   max: 5.0,   color: "#ef4444" },
];

const BRANCH_COLORS = {
  CSE: "#6366f1", "CSE-DS": "#ec4899", IT: "#8b5cf6",
  ECE: "#06b6d4", EEE: "#f59e0b", ME: "#10b981", CE: "#ef4444", Other: "#64748b",
};

/* ── Sub-components ─────────────────────────────────────── */
function DonutChart({ slices, size = 160 }) {
  const R   = size / 2 - 18;
  const cx  = size / 2;
  const cy  = size / 2;
  const total = slices.reduce((s, sl) => s + sl.value, 0);
  if (total === 0) return (
    <div style={{ width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ color: "var(--text-muted)", fontSize: 12 }}>No data</span>
    </div>
  );

  let cumAngle = -Math.PI / 2;
  const paths = slices.map((sl, i) => {
    if (sl.value === 0) return null;
    const fraction = sl.value / total;
    const angle    = fraction * 2 * Math.PI;
    const x1 = cx + R * Math.cos(cumAngle);
    const y1 = cy + R * Math.sin(cumAngle);
    cumAngle += angle;
    const x2 = cx + R * Math.cos(cumAngle);
    const y2 = cy + R * Math.sin(cumAngle);
    const largeArc = angle > Math.PI ? 1 : 0;
    const d = `M ${cx} ${cy} L ${x1} ${y1} A ${R} ${R} 0 ${largeArc} 1 ${x2} ${y2} Z`;
    return <path key={i} d={d} fill={sl.color} opacity={0.88} stroke="var(--bg-base)" strokeWidth={2} />;
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: "visible" }}>
      {paths}
      <circle cx={cx} cy={cy} r={R * 0.58} fill="var(--bg-elevated)" />
      <text x={cx} y={cy - 6}  textAnchor="middle" fill="var(--text-primary)" fontSize={18} fontWeight={700}>{total}</text>
      <text x={cx} y={cy + 14} textAnchor="middle" fill="var(--text-muted)"   fontSize={10} fontWeight={500}>Students</text>
    </svg>
  );
}

function HBar({ label, value, max, color }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div className="hbar-row">
      <span className="hbar-label">{label}</span>
      <div className="hbar-track">
        <div className="hbar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="hbar-val">{round2(value)}</span>
    </div>
  );
}

function MetricCard({ icon, label, value, sub, color }) {
  return (
    <div className="metric-card">
      <div className="metric-icon" style={{ background: `${color}20`, color }}>{icon}</div>
      <div className="metric-body">
        <div className="metric-value">{value}</div>
        <div className="metric-label">{label}</div>
        {sub && <div className="metric-sub">{sub}</div>}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   Analytics  — main component
   ══════════════════════════════════════════════════════════ */
export default function Analytics({ students }) {

  /* ── Filter state ──────────────────────────────────────── */
  const [fBranch,  setFBranch]  = useState("All");
  const [fYear,    setFYear]    = useState("All");
  const [fSection, setFSection] = useState("All");
  const [fCgpaMin, setFCgpaMin] = useState("");
  const [fCgpaMax, setFCgpaMax] = useState("");

  /* ── Derived option lists (from ALL students) ── */
  const branches = useMemo(() => ["All", ...new Set(students.map(s => s.branch))], [students]);
  const years    = useMemo(() => ["All", ...Array.from(new Set(students.map(s => String(s.year)))).sort()], [students]);
  const sections = useMemo(() => {
    const s = [...new Set(students.map(s => s.section).filter(Boolean))].sort();
    return s.length ? ["All", ...s] : [];
  }, [students]);

  const hasFilters = fBranch !== "All" || fYear !== "All" || fSection !== "All" || fCgpaMin !== "" || fCgpaMax !== "";

  const clearFilters = () => {
    setFBranch("All"); setFYear("All"); setFSection("All");
    setFCgpaMin(""); setFCgpaMax("");
  };

  /* ── Filtered students ─────────────────────────────────── */
  const filtered = useMemo(() => {
    const minC = fCgpaMin !== "" ? parseFloat(fCgpaMin) : null;
    const maxC = fCgpaMax !== "" ? parseFloat(fCgpaMax) : null;
    return students.filter(s => {
      if (fBranch  !== "All" && s.branch          !== fBranch)  return false;
      if (fYear    !== "All" && String(s.year)    !== fYear)    return false;
      if (fSection !== "All" && s.section         !== fSection) return false;
      if (minC !== null && Number(s.cgpa) < minC) return false;
      if (maxC !== null && Number(s.cgpa) > maxC) return false;
      return true;
    });
  }, [students, fBranch, fYear, fSection, fCgpaMin, fCgpaMax]);

  /* ── Derived analytics from FILTERED students ─────────── */
  const withCgpa   = useMemo(() => filtered.filter(s => Number(s.cgpa) > 0), [filtered]);
  const cgpaValues = useMemo(() => withCgpa.map(s => Number(s.cgpa)),         [withCgpa]);

  const avgCgpa    = round2(avg(cgpaValues));
  const maxCgpa    = cgpaValues.length ? Math.max(...cgpaValues) : 0;
  const minCgpa    = cgpaValues.length ? Math.min(...cgpaValues) : 0;
  const passing    = withCgpa.filter(s => Number(s.cgpa) >= 5).length;
  const passRate   = withCgpa.length ? Math.round((passing / withCgpa.length) * 100) : 0;
  const topStudent = filtered.reduce((best, s) => (!best || Number(s.cgpa) > Number(best.cgpa)) ? s : best, null);

  const branchMap = useMemo(() => {
    const m = {};
    filtered.forEach(s => {
      if (!m[s.branch]) m[s.branch] = { count: 0, cgpaSum: 0, n: 0 };
      m[s.branch].count++;
      if (Number(s.cgpa) > 0) { m[s.branch].cgpaSum += Number(s.cgpa); m[s.branch].n++; }
    });
    return Object.entries(m).map(([br, d]) => ({
      branch: br, count: d.count,
      avg: d.n ? round2(d.cgpaSum / d.n) : 0,
      color: BRANCH_COLORS[br] || "#64748b",
    })).sort((a, b) => b.avg - a.avg);
  }, [filtered]);

  const yearMap = useMemo(() => {
    const m = {};
    filtered.forEach(s => {
      const y = `Year ${s.year}`;
      if (!m[y]) m[y] = { count: 0, cgpaSum: 0, n: 0 };
      m[y].count++;
      if (Number(s.cgpa) > 0) { m[y].cgpaSum += Number(s.cgpa); m[y].n++; }
    });
    return Object.entries(m).map(([yr, d]) => ({
      year: yr, count: d.count, avg: d.n ? round2(d.cgpaSum / d.n) : 0,
    })).sort((a, b) => a.year.localeCompare(b.year));
  }, [filtered]);

  const sectionMap = useMemo(() => {
    const m = {};
    filtered.filter(s => s.section).forEach(s => {
      const k = `Sec ${s.section}`;
      if (!m[k]) m[k] = { count: 0, cgpaSum: 0, n: 0 };
      m[k].count++;
      if (Number(s.cgpa) > 0) { m[k].cgpaSum += Number(s.cgpa); m[k].n++; }
    });
    return Object.entries(m).map(([sec, d]) => ({
      section: sec, count: d.count, avg: d.n ? round2(d.cgpaSum / d.n) : 0,
    })).sort((a, b) => a.section.localeCompare(b.section));
  }, [filtered]);

  const gradeData = useMemo(() =>
    GRADE_BANDS.map(g => ({
      ...g, count: withCgpa.filter(s => Number(s.cgpa) >= g.min && Number(s.cgpa) < g.max).length,
    })),
    [withCgpa]
  );

  const top10 = useMemo(() =>
    [...filtered].filter(s => Number(s.cgpa) > 0)
      .sort((a, b) => Number(b.cgpa) - Number(a.cgpa))
      .slice(0, 10),
    [filtered]
  );

  const histogram = useMemo(() => {
    const buckets = [];
    for (let lo = 0; lo < 10; lo++) {
      buckets.push({ label: `${lo}–${lo + 1}`, count: cgpaValues.filter(v => v >= lo && v < lo + 1).length });
    }
    return buckets;
  }, [cgpaValues]);
  const histMax = Math.max(...histogram.map(b => b.count), 1);

  /* ── Empty state ─────────────────────────────────────── */
  if (!students.length) {
    return (
      <div className="analytics-empty">
        <span style={{ fontSize: 48 }}>📊</span>
        <p>No students yet — add some to see analytics!</p>
      </div>
    );
  }

  /* ─────────────────────────────────────────────────────── */
  return (
    <div className="analytics-wrap">

      {/* ══ FILTER BAR ══════════════════════════════════════ */}
      <div className="an-filter-bar">
        <div className="an-filter-bar-left">
          <span className="an-filter-icon">⚙️</span>
          <span className="an-filter-title">Filter Analytics</span>

          {/* Branch */}
          <div className="an-filter-group">
            <label className="an-filter-label">Branch</label>
            <select className="an-filter-select" value={fBranch} onChange={e => setFBranch(e.target.value)}>
              {branches.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          {/* Year */}
          <div className="an-filter-group">
            <label className="an-filter-label">Year</label>
            <select className="an-filter-select" value={fYear} onChange={e => setFYear(e.target.value)}>
              {years.map(y => <option key={y} value={y}>{y === "All" ? "All Years" : `Year ${y}`}</option>)}
            </select>
          </div>

          {/* Section */}
          {sections.length > 0 && (
            <div className="an-filter-group">
              <label className="an-filter-label">Section</label>
              <select className="an-filter-select" value={fSection} onChange={e => setFSection(e.target.value)}>
                {sections.map(s => <option key={s} value={s}>{s === "All" ? "All" : `Sec ${s}`}</option>)}
              </select>
            </div>
          )}

          {/* CGPA range */}
          <div className="an-filter-group">
            <label className="an-filter-label">CGPA</label>
            <div className="an-cgpa-range">
              <input
                type="number" min="0" max="10" step="0.1"
                placeholder="Min"
                value={fCgpaMin}
                onChange={e => setFCgpaMin(e.target.value)}
                className="an-cgpa-input"
              />
              <span className="an-cgpa-dash">–</span>
              <input
                type="number" min="0" max="10" step="0.1"
                placeholder="Max"
                value={fCgpaMax}
                onChange={e => setFCgpaMax(e.target.value)}
                className="an-cgpa-input"
              />
            </div>
          </div>

          {/* Clear */}
          {hasFilters && (
            <button className="an-clear-btn" onClick={clearFilters}>✕ Clear</button>
          )}
        </div>

        {/* Result count badge */}
        <div className="an-filter-result">
          <span className="an-result-num">{filtered.length}</span>
          <span className="an-result-of">/ {students.length} students</span>
          {hasFilters && <span className="an-active-tag">Filtered</span>}
        </div>
      </div>

      {/* No match state */}
      {filtered.length === 0 && (
        <div className="analytics-empty">
          <span style={{ fontSize: 36 }}>🔍</span>
          <p>No students match the selected filters.</p>
          <button className="an-clear-btn" onClick={clearFilters}>Clear Filters</button>
        </div>
      )}

      {filtered.length > 0 && (<>

      {/* ══ METRIC CARDS ════════════════════════════════════ */}
      <div className="metrics-row">
        <MetricCard icon="👥" label="Students Shown"  value={filtered.length}   sub={`${withCgpa.length} with CGPA data`}            color="#6366f1" />
        <MetricCard icon="⭐" label="Average CGPA"    value={avgCgpa || "—"}    sub={cgpaValues.length ? `Range: ${minCgpa} – ${maxCgpa}` : "No CGPA data"} color="#10b981" />
        <MetricCard icon="🏆" label="Top Performer"   value={topStudent?.name?.split(" ")[0] || "—"} sub={topStudent ? `CGPA ${Number(topStudent.cgpa).toFixed(2)} · ${topStudent.branch}` : ""} color="#f59e0b" />
        <MetricCard icon="✅" label="Pass Rate"       value={withCgpa.length ? `${passRate}%` : "—"} sub={`${passing} of ${withCgpa.length} students ≥ 5.0`} color="#ec4899" />
      </div>

      {/* ══ ROW 1: Grade Donut + Branch bars ════════════════ */}
      <div className="analytics-row">
        <div className="analytics-card">
          <h3 className="analytics-card-title">📈 Grade Distribution</h3>
          <div className="donut-wrap">
            <DonutChart
              slices={gradeData.filter(g => g.count > 0).map(g => ({ value: g.count, color: g.color }))}
              size={170}
            />
            <div className="donut-legend">
              {gradeData.map(g => (
                <div key={g.label} className="legend-item">
                  <span className="legend-dot"  style={{ background: g.color }} />
                  <span className="legend-label">{g.label}</span>
                  <span className="legend-count">{g.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="analytics-card">
          <h3 className="analytics-card-title">🏫 Branch-wise Avg CGPA</h3>
          {branchMap.length ? (
            <div className="hbar-list">
              {branchMap.map(b => (
                <HBar key={b.branch} label={`${b.branch} (${b.count})`} value={b.avg} max={10} color={b.color} />
              ))}
            </div>
          ) : <p className="an-no-data">No data for selected filters</p>}
        </div>
      </div>

      {/* ══ ROW 2: Histogram + Year/Section ════════════════ */}
      <div className="analytics-row">
        <div className="analytics-card">
          <h3 className="analytics-card-title">📊 CGPA Histogram</h3>
          <div className="histogram-wrap">
            {histogram.map(b => (
              <div key={b.label} className="hist-col">
                <span className="hist-count">{b.count || ""}</span>
                <div
                  className="hist-bar"
                  style={{
                    height: `${Math.max(4, (b.count / histMax) * 120)}px`,
                    background: `hsl(${(parseInt(b.label) / 10) * 140}deg 70% 55%)`,
                  }}
                />
                <span className="hist-label">{b.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="analytics-card">
          <h3 className="analytics-card-title">📅 Year-wise Performance</h3>
          {yearMap.length ? (
            <div className="hbar-list">
              {yearMap.map(y => (
                <HBar key={y.year} label={`${y.year} (${y.count})`} value={y.avg} max={10} color="#6366f1" />
              ))}
            </div>
          ) : <p className="an-no-data">No data</p>}

          {sectionMap.length > 0 && (
            <>
              <h3 className="analytics-card-title" style={{ marginTop: 22 }}>🔠 Section-wise Avg CGPA</h3>
              <div className="hbar-list">
                {sectionMap.map(s => (
                  <HBar key={s.section} label={`${s.section} (${s.count})`} value={s.avg} max={10} color="#ec4899" />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ══ ROW 3: Top 10 ═══════════════════════════════════ */}
      <div className="analytics-card analytics-card-full">
        <h3 className="analytics-card-title">🥇 Top 10 Performers</h3>
        {top10.length === 0
          ? <p className="an-no-data">No CGPA data for selected filters</p>
          : (
          <div className="top10-grid">
            {top10.map((s, i) => {
              const cgpa  = Number(s.cgpa);
              const color = BRANCH_COLORS[s.branch] || "#64748b";
              const medals = ["🥇", "🥈", "🥉"];
              return (
                <div key={s._id} className="top10-row">
                  <span className="top10-rank">{medals[i] || `#${i + 1}`}</span>
                  <div className="top10-avatar" style={{ background: `${color}33`, color }}>
                    {s.name.charAt(0)}
                  </div>
                  <div className="top10-info">
                    <span className="top10-name">{s.name}</span>
                    <span className="top10-meta">
                      {s.rollNo} · {s.branch}
                      {s.section ? ` · Sec ${s.section}` : ""}
                      {` · Year ${s.year}`}
                    </span>
                  </div>
                  <div className="top10-cgpa-wrap">
                    <div className="top10-bar-track">
                      <div className="top10-bar-fill" style={{ width: `${(cgpa / 10) * 100}%`, background: color }} />
                    </div>
                    <span className="top10-cgpa" style={{ color }}>{cgpa.toFixed(2)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      </>)}
    </div>
  );
}
