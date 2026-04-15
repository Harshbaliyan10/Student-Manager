import React, { useState, useEffect } from "react";

const BRANCHES = ["CSE", "CSE-DS", "IT", "ECE", "EEE", "ME", "CE", "Other"];
const SECTIONS = ["A", "B", "C", "D"];

// Default empty state for the form fields
const initialState = {
  name: "",
  email: "",
  rollNo: "",
  branch: "CSE",
  section: "",
  year: 1,
  cgpa: "",
  phone: "",
};

// StudentForm - A form component used for both adding a new student and editing an existing one.
// When editData is passed, it pre-fills the form with that student's info.
// When editData is null, it works as an "Add New Student" form.
const StudentForm = ({ onSubmit, editData, onCancel }) => {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // useEffect (populate form) - Runs whenever editData changes.
  // If editing a student, fills the form with their existing data.
  // If adding a new student, resets the form to empty.
  useEffect(() => {
    if (editData) {
      setForm({
        name: editData.name || "",
        email: editData.email || "",
        rollNo: editData.rollNo || "",
        branch: editData.branch || "CSE",
        section: editData.section || "",
        year: editData.year || 1,
        cgpa: editData.cgpa ?? "",
        phone: editData.phone || "",
      });
    } else {
      setForm(initialState);
    }
    setErrors({});
  }, [editData]);

  // validate - Checks that required fields are filled in and that the values are in the correct format.
  // Returns an object of error messages (empty object means no errors).
  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email))
      newErrors.email = "Invalid email format";
    if (!form.rollNo.trim()) newErrors.rollNo = "Roll No is required";
    if (form.cgpa !== "" && (form.cgpa < 0 || form.cgpa > 10))
      newErrors.cgpa = "CGPA must be between 0 and 10";
    return newErrors;
  };

  // handleChange - Updates a single form field in state when the user types or selects a value.
  // Also clears the error for that field as soon as the user starts correcting it.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // handleSubmit - Runs when the form is submitted.
  // First validates all fields, then calls the onSubmit prop (either handleCreate or handleUpdate from App.js).
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    try {
      await onSubmit({ ...form, year: Number(form.year), cgpa: Number(form.cgpa) });
      if (!editData) setForm(initialState); // reset form only after a successful "add"
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-card">
      <h2 className="form-title">
        {editData ? "✏️ Edit Student" : "➕ Add New Student"}
      </h2>
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          {/* Name */}
          <div className="field-group">
            <label>Full Name *</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Harsh Sharma"
              className={errors.name ? "input-error" : ""}
            />
            {errors.name && <span className="error-msg">{errors.name}</span>}
          </div>

          {/* Email */}
          <div className="field-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="e.g. harsh@college.edu"
              className={errors.email ? "input-error" : ""}
            />
            {errors.email && <span className="error-msg">{errors.email}</span>}
          </div>

          {/* Roll No */}
          <div className="field-group">
            <label>Roll No *</label>
            <input
              type="text"
              name="rollNo"
              value={form.rollNo}
              onChange={handleChange}
              placeholder="e.g. CS2021001"
              className={errors.rollNo ? "input-error" : ""}
            />
            {errors.rollNo && <span className="error-msg">{errors.rollNo}</span>}
          </div>

          {/* Branch */}
          <div className="field-group">
            <label>Branch *</label>
            <select name="branch" value={form.branch} onChange={handleChange}>
              {BRANCHES.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Section */}
          <div className="field-group">
            <label>Section</label>
            <select name="section" value={form.section} onChange={handleChange}>
              <option value="">— None —</option>
              {SECTIONS.map((s) => (
                <option key={s} value={s}>Section {s}</option>
              ))}
            </select>
          </div>

          {/* Year */}
          <div className="field-group">
            <label>Year *</label>
            <select name="year" value={form.year} onChange={handleChange}>
              {[1, 2, 3, 4].map((y) => (
                <option key={y} value={y}>Year {y}</option>
              ))}
            </select>
          </div>

          {/* CGPA */}
          <div className="field-group">
            <label>CGPA</label>
            <input
              type="number"
              name="cgpa"
              value={form.cgpa}
              onChange={handleChange}
              placeholder="0.0 – 10.0"
              step="0.01"
              min="0"
              max="10"
              className={errors.cgpa ? "input-error" : ""}
            />
            {errors.cgpa && <span className="error-msg">{errors.cgpa}</span>}
          </div>

          {/* Phone */}
          <div className="field-group">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="e.g. +91-9876543210"
            />
          </div>
        </div>

        <div className="form-actions">
          {/* Cancel button only shows in edit mode */}
          {editData && (
            <button type="button" className="btn-cancel" onClick={onCancel}>
              Cancel
            </button>
          )}
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Saving..." : editData ? "Update Student" : "Add Student"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentForm;
