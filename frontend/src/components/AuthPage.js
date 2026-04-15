import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

const AuthPage = () => {
  const { login, register } = useAuth();
  const [tab, setTab] = useState("login"); // "login" | "signup"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Login form state
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });

  // Signup form state
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const clearError = () => setError("");

  /* ── LOGIN ─────────────────────────────────────────── */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    const { email, password } = loginForm;
    if (!email || !password) return setError("Please fill in all fields.");
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ── SIGNUP ─────────────────────────────────────────── */
  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    const { name, email, password, confirmPassword } = signupForm;
    if (!name || !email || !password || !confirmPassword)
      return setError("Please fill in all fields.");
    if (password.length < 6)
      return setError("Password must be at least 6 characters.");
    if (password !== confirmPassword)
      return setError("Passwords do not match.");
    setLoading(true);
    try {
      await register(name, email, password);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const switchTab = (t) => {
    setTab(t);
    clearError();
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo-icon-wrap">🎓</div>
          <div>
            <h1 className="auth-title">Student Manager</h1>
            <p className="auth-subtitle">MERN CRUD — College Dashboard</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="auth-tabs">
          <button
            className={`auth-tab ${tab === "login" ? "active" : ""}`}
            onClick={() => switchTab("login")}
          >
            Login
          </button>
          <button
            className={`auth-tab ${tab === "signup" ? "active" : ""}`}
            onClick={() => switchTab("signup")}
          >
            Create Account
          </button>
        </div>

        {/* Error */}
        {error && <div className="auth-error">⚠️ {error}</div>}

        {/* ── LOGIN FORM ── */}
        {tab === "login" && (
          <form className="auth-form" onSubmit={handleLogin} noValidate>
            <div className="auth-field">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="you@college.edu"
                value={loginForm.email}
                onChange={(e) => {
                  setLoginForm((p) => ({ ...p, email: e.target.value }));
                  clearError();
                }}
                autoComplete="email"
              />
            </div>
            <div className="auth-field">
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={loginForm.password}
                onChange={(e) => {
                  setLoginForm((p) => ({ ...p, password: e.target.value }));
                  clearError();
                }}
                autoComplete="current-password"
              />
            </div>
            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? <span className="auth-spinner" /> : "Sign In →"}
            </button>
            <p className="auth-switch">
              New here?{" "}
              <span onClick={() => switchTab("signup")}>Create an account</span>
            </p>
          </form>
        )}

        {/* ── SIGNUP FORM ── */}
        {tab === "signup" && (
          <form className="auth-form" onSubmit={handleSignup} noValidate>
            <div className="auth-field">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="e.g. Harsh Sharma"
                value={signupForm.name}
                onChange={(e) => {
                  setSignupForm((p) => ({ ...p, name: e.target.value }));
                  clearError();
                }}
                autoComplete="name"
              />
            </div>
            <div className="auth-field">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="you@college.edu"
                value={signupForm.email}
                onChange={(e) => {
                  setSignupForm((p) => ({ ...p, email: e.target.value }));
                  clearError();
                }}
                autoComplete="email"
              />
            </div>
            <div className="auth-field">
              <label>Password</label>
              <input
                type="password"
                placeholder="Min. 6 characters"
                value={signupForm.password}
                onChange={(e) => {
                  setSignupForm((p) => ({ ...p, password: e.target.value }));
                  clearError();
                }}
                autoComplete="new-password"
              />
            </div>
            <div className="auth-field">
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="Re-enter your password"
                value={signupForm.confirmPassword}
                onChange={(e) => {
                  setSignupForm((p) => ({ ...p, confirmPassword: e.target.value }));
                  clearError();
                }}
                autoComplete="new-password"
              />
            </div>
            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? <span className="auth-spinner" /> : "Create Account →"}
            </button>
            <p className="auth-switch">
              Already have an account?{" "}
              <span onClick={() => switchTab("login")}>Sign in</span>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
