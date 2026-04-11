import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "../pages/Home.jsx";
import StudentLogin from "../pages/StudentLogin.jsx";
import StudentRegister from "../pages/StudentRegister.jsx";
import StudentDashboard from "../pages/StudentDashboard.jsx";
import AdminDashboard from "../pages/AdminDashboard.jsx";
import AdminLogin from "../pages/AdminLogin";

// Ometh's Components
import OmethHome from "../pages/OmethHome";
import OmethExternalView from "../pages/OmethExternalView";
import RoomChangeRequest from "./ometh/RoomChangeRequest/RoomChangeRequest";
import RoomDetailsForm from "./ometh/Add Room/RoomDetailsForm";
import RoomTransferRequest from "./ometh/RoomTransferRequest ADMIN/RoomTransferRequest";
import RoomManagementDashboard from "./ometh/RoomManagementDashboard/RoomManagementDashboard";
import RoomManageMentNavebar from "./ometh/RoomManageMentNavebar/RoomManageMentNavebar";
import RoomManagementSidebar from "./ometh/RoomManageMentNavebar/RoomManagementSidebar";
import OmethLayout from "../layouts/OmethLayout";

// Bagaya Payment components
import { App as PaymentApp } from "../PaymentApp";

// Hasinika Complaint components
import { ComplaintApp } from "../ComplaintApp";

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

        {/* Ometh's Routes */}
        <Route path="/ometh-home" element={<OmethHome />} />
        <Route path="/external" element={<OmethExternalView />} />
        <Route path="/room-change-request" element={<RoomChangeRequest />} />
        <Route path="/RoomDetailsForm" element={<OmethLayout><RoomDetailsForm /></OmethLayout>} />
        <Route path="/RoomTransferRequest" element={<OmethLayout><RoomTransferRequest /></OmethLayout>} />
        <Route path="/RoomManagementDashboard" element={<OmethLayout><RoomManagementDashboard /></OmethLayout>} />
        <Route path="/RoomManageMentNavebar" element={<RoomManageMentNavebar />} />
        <Route path="/RoomManagementSidebar" element={<RoomManagementSidebar />} />

        {/* Bagaya Payment Routes */}
        <Route path="/payment/*" element={<PaymentApp />} />

        {/* Hasinika Complaint Routes */}
        <Route path="/complaint/*" element={<ComplaintApp />} />

      </Routes>

    </BrowserRouter>

  );

}