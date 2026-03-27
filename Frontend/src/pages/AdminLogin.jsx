import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = "http://localhost:5000";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE}/api/admin/login`, { name, password });
      localStorage.setItem("adminToken", res.data.token);
      localStorage.setItem("adminData", JSON.stringify(res.data.admin));
      navigate("/admin-dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .al-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #08090d;
          font-family: 'DM Sans', sans-serif;
          padding: 24px;
          position: relative;
          overflow: hidden;
        }

        /* Subtle grid background */
        .al-page::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
        }

        /* Glowing orb */
        .al-page::after {
          content: '';
          position: absolute;
          top: -200px;
          right: -200px;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%);
          pointer-events: none;
          animation: pulse 6s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }

        .al-card {
          width: 100%;
          max-width: 440px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: 48px 40px;
          backdrop-filter: blur(20px);
          position: relative;
          z-index: 1;
          animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Top accent line */
        .al-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 40px;
          right: 40px;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(99,102,241,0.8), transparent);
        }

        .al-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: rgba(99,102,241,0.12);
          border: 1px solid rgba(99,102,241,0.25);
          color: #a5b4fc;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 5px 12px;
          border-radius: 100px;
          margin-bottom: 28px;
          font-family: 'DM Sans', sans-serif;
        }

        .al-badge-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #6366f1;
          box-shadow: 0 0 6px #6366f1;
          animation: blink 2s ease-in-out infinite;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        .al-title {
          font-family: 'Syne', sans-serif;
          font-size: 32px;
          font-weight: 800;
          color: #f8fafc;
          letter-spacing: -0.02em;
          line-height: 1.1;
          margin-bottom: 8px;
        }

        .al-title span {
          color: #6366f1;
        }

        .al-sub {
          color: rgba(248, 250, 252, 0.4);
          font-size: 14px;
          font-weight: 300;
          margin-bottom: 36px;
          line-height: 1.6;
        }

        .al-error {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #fca5a5;
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 400;
          margin-bottom: 24px;
          animation: shake 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
        }

        @keyframes shake {
          10%, 90% { transform: translateX(-2px); }
          20%, 80% { transform: translateX(3px); }
          30%, 50%, 70% { transform: translateX(-4px); }
          40%, 60% { transform: translateX(4px); }
        }

        .al-error-icon {
          width: 16px;
          height: 16px;
          flex-shrink: 0;
          background: rgba(239,68,68,0.3);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          color: #ef4444;
        }

        .al-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .al-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .al-label {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(248,250,252,0.35);
          font-family: 'Syne', sans-serif;
        }

        .al-input-wrap {
          position: relative;
        }

        .al-input-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(248,250,252,0.2);
          pointer-events: none;
          transition: color 0.2s;
          display: flex;
          align-items: center;
        }

        .al-input-wrap.focused .al-input-icon {
          color: #6366f1;
        }

        .al-input {
          width: 100%;
          padding: 14px 16px 14px 44px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          color: #f8fafc;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 400;
          outline: none;
          transition: all 0.2s ease;
          letter-spacing: 0.01em;
        }

        .al-input::placeholder {
          color: rgba(248,250,252,0.18);
        }

        .al-input:focus {
          background: rgba(99, 102, 241, 0.06);
          border-color: rgba(99, 102, 241, 0.5);
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .al-btn {
          margin-top: 8px;
          width: 100%;
          padding: 15px;
          background: linear-gradient(135deg, #6366f1, #818cf8);
          border: none;
          border-radius: 12px;
          color: #fff;
          font-family: 'Syne', sans-serif;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: all 0.25s ease;
        }

        .al-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #818cf8, #6366f1);
          opacity: 0;
          transition: opacity 0.25s;
        }

        .al-btn:hover:not(:disabled)::before { opacity: 1; }
        .al-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(99,102,241,0.4); }
        .al-btn:active:not(:disabled) { transform: translateY(0); }
        .al-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .al-btn-text { position: relative; z-index: 1; display: flex; align-items: center; justify-content: center; gap: 8px; }

        .al-spinner {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .al-back {
          width: 100%;
          padding: 13px;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          color: rgba(248,250,252,0.4);
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 400;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .al-back:hover {
          border-color: rgba(255,255,255,0.15);
          color: rgba(248,250,252,0.65);
          background: rgba(255,255,255,0.03);
        }

        .al-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 4px 0;
        }

        .al-divider-line {
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.06);
        }

        .al-divider-text {
          font-size: 11px;
          color: rgba(248,250,252,0.18);
          font-weight: 400;
        }

        .al-footer {
          margin-top: 32px;
          padding-top: 20px;
          border-top: 1px solid rgba(255,255,255,0.05);
          text-align: center;
          font-size: 11px;
          color: rgba(248,250,252,0.15);
          letter-spacing: 0.03em;
        }
      `}</style>

      <div className="al-page">
        <div className="al-card">
          <div className="al-badge">
            <span className="al-badge-dot"></span>
            Secure Portal
          </div>

          <h1 className="al-title">Admin <span>Sign In</span></h1>
          <p className="al-sub">Authorized personnel only. All access is monitored and logged.</p>

          {error && (
            <div className="al-error">
              <div className="al-error-icon">!</div>
              {error}
            </div>
          )}

          <form className="al-form" onSubmit={handleSubmit}>
            <div className="al-field">
              <label className="al-label">Admin Name</label>
              <div className={`al-input-wrap ${focusedField === 'name' ? 'focused' : ''}`}>
                <span className="al-input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                </span>
                <input
                  className="al-input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter admin name"
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="al-field">
              <label className="al-label">Password</label>
              <div className={`al-input-wrap ${focusedField === 'password' ? 'focused' : ''}`}>
                <span className="al-input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <input
                  className="al-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter password"
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button className="al-btn" type="submit" disabled={loading}>
              <span className="al-btn-text">
                {loading ? (
                  <>
                    <span className="al-spinner"></span>
                    Authenticating...
                  </>
                ) : (
                  <>
                    Sign In
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </>
                )}
              </span>
            </button>

            <div className="al-divider">
              <div className="al-divider-line"></div>
              <span className="al-divider-text">or</span>
              <div className="al-divider-line"></div>
            </div>

            <button type="button" className="al-back" onClick={() => navigate("/")}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Back to Home
            </button>
          </form>

          <div className="al-footer">
            Protected by enterprise-grade encryption · v2.0
          </div>
        </div>
      </div>
    </>
  );
}