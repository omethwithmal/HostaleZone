import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function StudentRegister() {
  const navigate = useNavigate();
  const [student, setStudent] = useState({
    studentId: "",
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    department: "",
    year: "",
    semester: "",
    address: "",
    profilePhoto: null,
  });

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Handle input change
  const handleChange = (e) => {
    if (e.target.name === "profilePhoto") {
      setStudent({ ...student, profilePhoto: e.target.files[0] });
    } else {
      setStudent({ ...student, [e.target.name]: e.target.value });
    }
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (student.password !== student.confirmPassword) {
      setErrorMessage("Passwords do not match");
      setShowErrorPopup(true);
      return;
    }

    const formData = new FormData();
    Object.keys(student).forEach((key) => {
      // Don't append raw year/semester as backend takes a standard yearSemester field
      if (key === "year" || key === "semester") return;
      
      const value = student[key];
      if (value != null && value !== "") {
        formData.append(key, value);
      }
    });

    // Combine year and semester manually
    const combinedYearSemester = `Year ${student.year} Semester ${student.semester}`;
    formData.append("yearSemester", combinedYearSemester);

    try {
      await axios.post(
        "http://localhost:5000/api/student/register",
        formData
      );
      setShowSuccessPopup(true);
      setStudent({
        studentId: "",
        fullName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        department: "",
        year: "",
        semester: "",
        address: "",
        profilePhoto: null,
      });
      // Optionally delay or wait for them to click OK on the popup to navigate
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      const msg = error.response?.data?.error || error.response?.data?.message || error.message || "Registration Failed!";
      setErrorMessage(msg);
      setShowErrorPopup(true);
    }
  };

  const handleSuccessOk = () => {
    setShowSuccessPopup(false);
    navigate("/login");
  };

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .student-register {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 40px 20px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .student-register-card {
          background: #ffffff;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          padding: 50px 60px;
          max-width: 700px;
          width: 100%;
          animation: slideDown 0.5s ease-out;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .student-register-card h2 {
          color: #2563eb !important;
          font-size: 32px;
          font-weight: 700;
          text-align: center;
          margin-bottom: 0px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .back-arrow {
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
          text-decoration: none;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #f1f5f9;
          transition: all 0.3s ease;
        }

        .back-arrow:hover {
          background: #e2e8f0;
          color: #3b82f6;
          transform: translateY(-50%) translateX(-3px);
        }

        .form-subtitle {
          text-align: center;
          color: #64748b;
          font-size: 15px;
          margin-bottom: 35px;
          font-weight: 400;
        }

        .student-form {
          width: 100%;
        }

        .form-group {
          margin-bottom: 25px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 25px;
        }

        .form-group label {
          display: block;
          color: #1e293b;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 8px;
          letter-spacing: 0.3px;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 14px 18px;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          font-size: 15px;
          color: #334155;
          background: #f8fafc;
          transition: all 0.3s ease;
          font-family: inherit;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #3b82f6;
          background: #ffffff;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }

        .form-group input::placeholder,
        .form-group textarea::placeholder {
          color: #94a3b8;
        }

        .form-group textarea {
          resize: vertical;
          min-height: 90px;
        }

        .file-input-wrapper input[type="file"] {
          padding: 12px 14px;
          cursor: pointer;
          background: #eff6ff;
          border-color: #bfdbfe;
        }

        .file-input-wrapper input[type="file"]::-webkit-file-upload-button {
          background: #3b82f6;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          font-size: 13px;
          margin-right: 12px;
          transition: background 0.3s ease;
        }

        .file-input-wrapper input[type="file"]::-webkit-file-upload-button:hover {
          background: #2563eb;
        }

        .submit-btn {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          margin-top: 10px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
          letter-spacing: 0.5px;
        }

        .submit-btn:hover {
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.5);
          transform: translateY(-2px);
        }

        .submit-btn:active {
          transform: translateY(0);
        }

        .login-register-link {
          text-align: center;
          margin-top: 25px;
          color: #64748b;
          font-size: 14px;
        }

        .login-register-link a {
          color: #3b82f6;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.3s ease;
        }

        .login-register-link a:hover {
          color: #2563eb;
          text-decoration: underline;
        }

        /* Popup Styles */
        .popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .popup-modal {
          background: white;
          border-radius: 20px;
          padding: 40px 50px;
          text-align: center;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          animation: popIn 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          min-width: 350px;
        }

        @keyframes popIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .popup-icon {
          width: 80px;
          height: 80px;
          margin: 0 auto 20px;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 48px;
          font-weight: bold;
        }

        .success-popup .popup-icon {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
        }

        .error-popup .popup-icon {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
        }

        .popup-message {
          font-size: 18px;
          color: #1e293b;
          margin-bottom: 25px;
          font-weight: 500;
          line-height: 1.5;
        }

        .popup-close-btn {
          padding: 12px 40px;
          border: none;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          letter-spacing: 0.5px;
        }

        .success-popup .popup-close-btn {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
        }

        .success-popup .popup-close-btn:hover {
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
        }

        .error-popup .popup-close-btn {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
        }

        .error-popup .popup-close-btn:hover {
          background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
          box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .student-register-card {
            padding: 35px 25px;
          }

          .student-register-card h2 {
            font-size: 26px;
          }

          .form-row {
            grid-template-columns: 1fr;
            gap: 0;
          }

          .popup-modal {
            min-width: 300px;
            padding: 35px 30px;
          }

          .popup-icon {
            width: 70px;
            height: 70px;
            font-size: 40px;
          }
        }

        @media (max-width: 480px) {
          .student-register {
            padding: 20px 15px;
          }

          .student-register-card {
            padding: 30px 20px;
          }

          .student-register-card h2 {
            font-size: 24px;
          }

          .form-subtitle {
            font-size: 14px;
          }
        }
      `}</style>

      <div className="student-register">
        <div className="student-register-card">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', marginBottom: '10px' }}>
            <h2 style={{ color: '#2563eb' }}>Student Registration</h2>
            <Link to="/" className="back-arrow" title="Back to Home">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
          </div>
          <p className="form-subtitle">Join your hostel community — fill in your details below</p>

          <form onSubmit={handleSubmit} encType="multipart/form-data" className="student-form">
            <div className="form-row">
              <div className="form-group">
                <label>IT Number</label>
                <input type="text" name="studentId" placeholder="ex: IT23139312"
                  value={student.studentId} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" name="fullName" placeholder="Enter your full name"
                  value={student.fullName} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" placeholder="your@email.com"
                  value={student.email} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input type="text" name="phone" placeholder="Phone number"
                  value={student.phone} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Password</label>
                <input type="password" name="password" placeholder="Create a password"
                  value={student.password} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input type="password" name="confirmPassword" placeholder="Confirm password"
                  value={student.confirmPassword} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-group">
              <label>Department / Faculty</label>
              <select name="department" value={student.department} onChange={handleChange} required style={{ width: "100%", padding: "14px 18px", border: "2px solid #e2e8f0", borderRadius: "10px", fontSize: "15px", color: "#334155", background: "#f8fafc", fontFamily: "inherit", outline: "none", cursor: "pointer" }}>
                <option value="" disabled>Select your faculty</option>
                <option value="Computing / IT">Computing / IT</option>
                <option value="Business">Business</option>
                <option value="Engineering">Engineering</option>
                <option value="Humanities & Sciences">Humanities & Sciences</option>
                <option value="Architecture">Architecture</option>
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Year</label>
                <select name="year" value={student.year} onChange={handleChange} required style={{ width: "100%", padding: "14px 18px", border: "2px solid #e2e8f0", borderRadius: "10px", fontSize: "15px", color: "#334155", background: "#f8fafc", fontFamily: "inherit", outline: "none", cursor: "pointer" }}>
                  <option value="" disabled>Select Year</option>
                  <option value="1">Year 1</option>
                  <option value="2">Year 2</option>
                  <option value="3">Year 3</option>
                  <option value="4">Year 4</option>
                </select>
              </div>
              <div className="form-group">
                <label>Semester</label>
                <select name="semester" value={student.semester} onChange={handleChange} required style={{ width: "100%", padding: "14px 18px", border: "2px solid #e2e8f0", borderRadius: "10px", fontSize: "15px", color: "#334155", background: "#f8fafc", fontFamily: "inherit", outline: "none", cursor: "pointer" }}>
                  <option value="" disabled>Select Semester</option>
                  <option value="1">Semester 1</option>
                  <option value="2">Semester 2</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Address</label>
              <textarea name="address" placeholder="Your full address"
                value={student.address} onChange={handleChange} required rows={3}></textarea>
            </div>

            <div className="form-group file-input-wrapper">
              <label>Profile Photo</label>
              <input type="file" name="profilePhoto" accept="image/*"
                onChange={handleChange} required />
            </div>

            <button type="submit" className="submit-btn">Create Account</button>

            <p className="login-register-link">
              Already have an account? <Link to="/login">Login here</Link>
            </p>
          </form>
        </div>

        {/* Success Popup */}
        {showSuccessPopup && (
          <div className="popup-overlay" onClick={() => { setShowSuccessPopup(false); navigate("/login"); }}>
            <div className="popup-modal success-popup" onClick={(e) => e.stopPropagation()}>
              <div className="popup-icon">✓</div>
              <p className="popup-message">Registration successfully</p>
              <button className="popup-close-btn" onClick={() => { setShowSuccessPopup(false); navigate("/login"); }}>OK</button>
            </div>
          </div>
        )}

        {/* Error Popup */}
        {showErrorPopup && (
          <div className="popup-overlay" onClick={() => { setShowErrorPopup(false); setErrorMessage(""); }}>
            <div className="popup-modal error-popup" onClick={(e) => e.stopPropagation()}>
              <div className="popup-icon">✕</div>
              <p className="popup-message">{errorMessage || "Registration Failed!"}</p>
              <button className="popup-close-btn" onClick={() => { setShowErrorPopup(false); setErrorMessage(""); }}>OK</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default StudentRegister;
