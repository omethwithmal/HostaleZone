import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import StudentLogin from "../pages/StudentLogin";
import StudentRegister from "../pages/StudentRegister";
import StudentDashboard from "../pages/StudentDashboard";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("studentToken");
  return token ? children : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<StudentLogin />} />
        <Route path="/register" element={<StudentRegister />} />

        {/* ✅ IMPORTANT: /dashboard/* for nested routes */}
        <Route
          path="/dashboard/*"
          element={
            <PrivateRoute>
              <StudentDashboard />
            </PrivateRoute>
          }
        />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
