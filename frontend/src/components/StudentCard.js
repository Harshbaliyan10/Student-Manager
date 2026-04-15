import React from "react";

// Branch color map - Each branch gets a distinct accent color
const branchColors = {
  CSE:      "#6366f1",
  "CSE-DS": "#ec4899",
  IT:       "#8b5cf6",
  ECE:      "#06b6d4",
  EEE:      "#f59e0b",
  ME:       "#10b981",
  CE:       "#ef4444",
  Other:    "#64748b",
};

// StudentCard - Displays a single student's information as a premium dark card.
const StudentCard = ({ student, onEdit, onDelete }) => {
  const { _id, name, email, rollNo, branch, section, year, cgpa, phone } = student;
  const branchColor = branchColors[branch] || "#64748b";

  // getCgpaColor - Returns a color + label based on CGPA value
  const getCgpaColor = (val) => {
    if (val >= 8.5) return { color: "#10b981", label: "Excellent" };
    if (val >= 7)   return { color: "#6366f1", label: "Good" };
    if (val >= 5)   return { color: "#f59e0b", label: "Average" };
    return              { color: "#ef4444", label: "Poor" };
  };

  const cgpaNum = Number(cgpa);
  const { color: cgpaColor } = getCgpaColor(cgpaNum);
  const cgpaPercent = Math.min(100, (cgpaNum / 10) * 100);

  const yearLabels = ["", "1st", "2nd", "3rd", "4th"];

  return (
    <div className="student-card">
      {/* Top accent bar */}
      <div
        className="card-accent-bar"
        style={{ background: `linear-gradient(90deg, ${branchColor}, ${branchColor}80)` }}
      />

      {/* Header */}
      <div className="card-header">
        <div
          className="avatar"
          style={{ background: `linear-gradient(135deg, ${branchColor}cc, ${branchColor}66)` }}
        >
          {name.charAt(0).toUpperCase()}
        </div>
        <div className="card-meta">
          <h3 className="student-name">{name}</h3>
          <div className="roll-meta">
            <span className="roll-no">{rollNo}</span>
            {section && (
              <span className="section-chip">Sec {section}</span>
            )}
          </div>
        </div>
        <span
          className="branch-badge"
          style={{ background: `${branchColor}22`, color: branchColor, border: `1px solid ${branchColor}44` }}
        >
          {branch}
        </span>
      </div>

      {/* Body */}
      <div className="card-body">
        <div className="info-row">
          <span className="info-icon">✉️</span>
          <span className="info-text">{email}</span>
        </div>

        {phone && (
          <div className="info-row">
            <span className="info-icon">📱</span>
            <span className="info-text">{phone}</span>
          </div>
        )}

        <div className="info-row">
          <span className="info-icon">📅</span>
          <span className="info-text">{yearLabels[year] || year} Year</span>
        </div>

        {cgpaNum > 0 && (
          <div className="cgpa-row">
            <span className="info-icon">⭐</span>
            <span className="cgpa-badge" style={{ color: cgpaColor }}>
              {cgpaNum.toFixed(2)}
            </span>
            <div className="cgpa-bar-wrap">
              <div
                className="cgpa-bar"
                style={{ width: `${cgpaPercent}%`, background: cgpaColor }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="card-actions">
        <button className="btn-edit" onClick={() => onEdit(student)}>
          ✏️ Edit
        </button>
        <button className="btn-delete" onClick={() => onDelete(_id)}>
          🗑️ Remove
        </button>
      </div>
    </div>
  );
};

export default StudentCard;
