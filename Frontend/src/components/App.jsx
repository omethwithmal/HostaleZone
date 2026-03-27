import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "../pages/Home.jsx";
import StudentLogin from "../pages/StudentLogin.jsx";
import StudentRegister from "../pages/StudentRegister.jsx";
import StudentDashboard from "../pages/StudentDashboard.jsx";
import AdminDashboard from "../pages/AdminDashboard.jsx";
import AdminLogin from "../pages/AdminLogin";


function PrivateRoute({ children }) {

  const token = localStorage.getItem("studentToken");

  return token ? children : <Navigate to="/login" />;

}


export default function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<StudentLogin />} />

        <Route path="/register" element={<StudentRegister />} />

        <Route path="/admin-dashboard" element={<AdminDashboard />} />

        <Route
          path="/dashboard/*"
          element={
            <PrivateRoute>
              <StudentDashboard />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />

        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-login" element={<AdminLogin />} />

      </Routes>

    </BrowserRouter>

  );

}