import React from "react";
import { Routes, Route } from "react-router-dom";

import NaveBar from "./components/complaints_module/NaveBar/NaveBar";
import Footer from "./components/complaints_module/Footer/Footer";

import Home from "./components/complaints_module/complain/Home";
import Dashboard from "./components/complaints_module/complain/Dashboard";
import Complaints from "./components/complaints_module/complain/complain";
import NewComplaint from "./components/complaints_module/complain/NewComplaint";
import AdminPanel from "./components/complaints_module/complain/AdminPanel";

function StudentLayout({ children }) {
  return (
    <>
      <NaveBar />
      <main className="pt-24 pb-12">{children}</main>
      <Footer />
    </>
  );
}

export function ComplaintApp() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="fixed inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(circle_at_top,_rgba(29,78,216,0.18),_transparent_45%),linear-gradient(180deg,_#eff6ff_0%,_#f8fafc_55%,_#f8fafc_100%)]" />
      <Routes>
        <Route path="/" element={<StudentLayout><Home /></StudentLayout>} />
        <Route path="/dashboard" element={<StudentLayout><Dashboard /></StudentLayout>} />
        <Route path="/complaints" element={<StudentLayout><Complaints /></StudentLayout>} />
        <Route path="/new" element={<StudentLayout><NewComplaint /></StudentLayout>} />
        <Route path="/admin" element={<main className="pb-12 pt-8"><AdminPanel /></main>} />
      </Routes>
    </div>
  );
}
