import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function StudentLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/student/login",
        form
      );

      // save token + student
      const token = res.data?.token;
      const student = res.data?.student;
      if (!token || !student) {
        alert("Invalid response from server. Please try again.");
        return;
      }
      localStorage.setItem("studentToken", token);
      localStorage.setItem("studentData", JSON.stringify(student));

      // Navigate to student dashboard (use window.location to ensure reliable navigation)
      window.location.replace("/dashboard");
    } catch (err) {
      const msg = err?.response?.data?.message
        || (err?.message === "Network Error" ? "Cannot reach server. Is the backend running on port 5000?" : err?.message)
        || "Login failed";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <form style={styles.card} onSubmit={handleSubmit}>
        <h2 style={{ marginBottom: "20px" }}>Student Login</h2>

        <label style={styles.label}>Email</label>
        <input
          style={styles.input}
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Enter email"
          required
        />

        <label style={styles.label}>Password</label>
        <input
          style={styles.input}
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Enter password"
          required
        />

        <button style={styles.btn} type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p style={{ marginTop: "15px", fontSize: "14px" }}>
          Don’t have an account? <Link to="/register">Register here</Link>
        </p>
      </form>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f5f5",
    padding: "20px",
  },
  card: {
    width: "350px",
    background: "white",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
  },
  label: {
    display: "block",
    marginBottom: "6px",
    fontWeight: "600",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
  },
  btn: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    background: "#1f6feb",
    color: "white",
    fontWeight: "600",
    cursor: "pointer",
  },
};
