import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:5000";

export default function AdminLeaveManagement() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState({ show: false, type: "success", msg: "" });
  const [actionLeave, setActionLeave] = useState(null);
  const [actionStatus, setActionStatus] = useState("");
  const [adminComment, setAdminComment] = useState("");

  const adminToken = localStorage.getItem("adminToken");
  const axiosConfig = useMemo(() => {
    const headers = {};
    if (adminToken) headers.Authorization = `Bearer ${adminToken}`;
    return { headers };
  }, [adminToken]);

  const showToast = (type, msg) => {
    setToast({ show: true, type, msg });
    setTimeout(() => setToast({ show: false, type: "success", msg: "" }), 3000);
  };

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/api/admin/leaves`, {
        params: { status: statusFilter === "all" ? undefined : statusFilter, search: search.trim() || undefined },
        ...axiosConfig,
      });
      setLeaves(res.data?.leaves || []);
    } catch (err) {
      if (err?.response?.status === 401) {
        showToast("error", "Session expired. Please login again.");
        return;
      }
      showToast("error", err?.response?.data?.message || err?.message || "Failed to load leaves");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [statusFilter]);

  useEffect(() => {
    const t = setTimeout(() => fetchLeaves(), 400);
    return () => clearTimeout(t);
  }, [search]);

  const handleStatusSubmit = async () => {
    if (!actionLeave || !actionStatus) return;
    try {
      await axios.put(
        `${API_BASE}/api/admin/leaves/${actionLeave._id}/status`,
        { status: actionStatus, adminComment: adminComment.trim() || undefined },
        axiosConfig
      );
      showToast("success", actionStatus === "approved" ? "Leave approved" : "Leave rejected");
      setActionLeave(null);
      setActionStatus("");
      setAdminComment("");
      fetchLeaves();
    } catch (err) {
      showToast("error", err?.response?.data?.message || err?.message || "Update failed");
    }
  };

  const formatDate = (d) => {
    if (!d) return "-";
    try {
      return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    } catch {
      return "-";
    }
  };

  const openAction = (leave, status) => {
    setActionLeave(leave);
    setActionStatus(status);
    setAdminComment("");
  };

  return (
    <>
      <div className="cardHeader" style={{ marginBottom: 16 }}>
        <div className="searchWrap" style={{ maxWidth: 280 }}>
          <span>🔍</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search student name, email..."
          />
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid var(--slate-200)",
              background: "var(--slate-50)",
              color: "var(--slate-800)",
            }}
          >
            <option value="all">All status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <button className="refreshBtn" onClick={fetchLeaves}>
            {loading ? "⟳ Loading" : "⟳ Refresh"}
          </button>
        </div>
      </div>

      <div className="tableWrap">
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Type</th>
              <th>From – To</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {!loading && leaves.length === 0 && (
              <tr>
                <td colSpan="6" style={{ padding: 0, background: "transparent", border: "none" }}>
                  <div className="emptyState">
                    <div className="emptyIcon">📋</div>
                    <div className="emptyText">No leave requests found.</div>
                  </div>
                </td>
              </tr>
            )}
            {loading && leaves.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: 40, color: "var(--slate-400)", border: "none" }}>
                  Loading...
                </td>
              </tr>
            )}
            {leaves.map((l) => {
              const st = l.student || {};
              const isPending = l.status === "pending";
              return (
                <tr key={l._id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{st.fullName || "-"}</div>
                    <div style={{ fontSize: 12, color: "var(--slate-500)" }}>{st.email || "-"}</div>
                  </td>
                  <td>{l.leaveType || "-"}</td>
                  <td>
                    {formatDate(l.fromDate)} – {formatDate(l.toDate)}
                  </td>
                  <td style={{ maxWidth: 180 }} title={l.reason}>
                    {(l.reason || "-").slice(0, 40)}
                    {(l.reason || "").length > 40 ? "…" : ""}
                  </td>
                  <td>
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: 500,
                        background:
                          l.status === "approved"
                            ? "var(--green-100)"
                            : l.status === "rejected"
                            ? "var(--red-100)"
                            : "var(--amber-100)",
                        color:
                          l.status === "approved"
                            ? "var(--green-800)"
                            : l.status === "rejected"
                            ? "var(--red-800)"
                            : "var(--amber-800)",
                      }}
                    >
                      {l.status}
                    </span>
                  </td>
                  <td>
                    {isPending && (
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          type="button"
                          className="refreshBtn"
                          style={{ padding: "6px 10px", fontSize: 12 }}
                          onClick={() => openAction(l, "approved")}
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          style={{
                            padding: "6px 10px",
                            fontSize: 12,
                            background: "var(--red-500)",
                            color: "white",
                            border: "none",
                            borderRadius: 8,
                            cursor: "pointer",
                          }}
                          onClick={() => openAction(l, "rejected")}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {!isPending && l.adminComment && (
                      <span style={{ fontSize: 12, color: "var(--slate-500)" }} title={l.adminComment}>
                        {l.adminComment.slice(0, 20)}…
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {toast.show && (
        <div
          className="toast"
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            padding: "12px 20px",
            borderRadius: 8,
            background: toast.type === "success" ? "var(--green-600)" : "var(--red-600)",
            color: "white",
            zIndex: 9999,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
        >
          {toast.msg}
        </div>
      )}

      {actionLeave && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => {
            setActionLeave(null);
            setActionStatus("");
            setAdminComment("");
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: 12,
              padding: 24,
              maxWidth: 400,
              width: "90%",
              boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: "0 0 8px", fontSize: 18 }}>
              {actionStatus === "approved" ? "Approve" : "Reject"} leave request
            </h3>
            <p style={{ margin: "0 0 16px", color: "var(--slate-600)", fontSize: 14 }}>
              {(actionLeave.student || {}).fullName} – {formatDate(actionLeave.fromDate)} to{" "}
              {formatDate(actionLeave.toDate)}
            </p>
            <label style={{ display: "block", marginBottom: 4, fontSize: 14, fontWeight: 500 }}>
              Comment (optional)
            </label>
            <textarea
              value={adminComment}
              onChange={(e) => setAdminComment(e.target.value)}
              placeholder={actionStatus === "rejected" ? "Reason for rejection..." : "Note..."}
              rows={3}
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 8,
                border: "1px solid var(--slate-200)",
                marginBottom: 16,
                resize: "vertical",
              }}
            />
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button
                type="button"
                className="refreshBtn"
                onClick={() => {
                  setActionLeave(null);
                  setActionStatus("");
                  setAdminComment("");
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                style={{
                  padding: "8px 16px",
                  borderRadius: 8,
                  border: "none",
                  cursor: "pointer",
                  background: actionStatus === "approved" ? "var(--green-600)" : "var(--red-600)",
                  color: "white",
                  fontWeight: 500,
                }}
                onClick={handleStatusSubmit}
              >
                {actionStatus === "approved" ? "Approve" : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
