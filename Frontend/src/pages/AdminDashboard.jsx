import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:5000";

// ─── Shared helpers ───────────────────────────────────────────────────────────
const AVATAR_COLORS = ["#6366f1","#10b981","#f59e0b","#ef4444","#8b5cf6","#06b6d4","#ec4899","#f97316"];

function Avatar({ name, src, size = 36 }) {
  const initials = (name||"?").split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2);
  const color = AVATAR_COLORS[(name||"").charCodeAt(0) % AVATAR_COLORS.length];
  const r = size <= 36 ? 10 : 14;
  if (src) return <img src={src} alt={name} style={{ width:size, height:size, borderRadius:r, objectFit:"cover", border:"1px solid rgba(255,255,255,.08)", flexShrink:0 }} />;
  return (
    <div style={{ width:size, height:size, borderRadius:r, flexShrink:0, background:`${color}20`, border:`1px solid ${color}40`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:size<=36?13:18, color }}>
      {initials}
    </div>
  );
}

function StatusPill({ active }) {
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"3px 10px", borderRadius:999, background:active?"rgba(16,185,129,.1)":"rgba(239,68,68,.1)", border:`1px solid ${active?"rgba(16,185,129,.25)":"rgba(239,68,68,.25)"}`, color:active?"#6ee7b7":"#fca5a5", fontSize:11, fontWeight:600, fontFamily:"'Syne',sans-serif", letterSpacing:"0.04em", textTransform:"uppercase", whiteSpace:"nowrap" }}>
      <span style={{ width:6, height:6, borderRadius:"50%", background:active?"#10b981":"#ef4444", boxShadow:active?"0 0 6px #10b981":"0 0 6px #ef4444" }} />
      {active ? "Active" : "Blocked"}
    </span>
  );
}

function Toast({ toast }) {
  if (!toast.show) return null;
  const ok = toast.type === "success";
  return (
    <div style={{ position:"fixed", bottom:28, right:28, zIndex:9999, padding:"13px 20px", borderRadius:14, background:ok?"#071a12":"#1a0707", border:`1px solid ${ok?"rgba(16,185,129,.3)":"rgba(239,68,68,.3)"}`, color:ok?"#6ee7b7":"#fca5a5", fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:500, display:"flex", alignItems:"center", gap:10, boxShadow:"0 20px 50px rgba(0,0,0,.5)", animation:"adToastIn .3s cubic-bezier(.16,1,.3,1) both" }}>
      {ok ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>}
      {toast.msg}
    </div>
  );
}

// ─── Leave helpers ─────────────────────────────────────────────────────────────
const LEAVE_STATUS_CFG = {
  pending:  { color:"#f59e0b", bg:"rgba(245,158,11,.1)",  border:"rgba(245,158,11,.25)",  label:"Pending"  },
  approved: { color:"#10b981", bg:"rgba(16,185,129,.1)",  border:"rgba(16,185,129,.25)",  label:"Approved" },
  rejected: { color:"#ef4444", bg:"rgba(239,68,68,.1)",   border:"rgba(239,68,68,.25)",   label:"Rejected" },
};
const LEAVE_TYPE_CFG = {
  Medical:  { bg:"rgba(59,130,246,.1)",  border:"rgba(59,130,246,.25)",  color:"#93c5fd" },
  Family:   { bg:"rgba(168,85,247,.1)",  border:"rgba(168,85,247,.25)",  color:"#d8b4fe" },
  Personal: { bg:"rgba(249,115,22,.1)",  border:"rgba(249,115,22,.25)",  color:"#fdba74" },
  Sports:   { bg:"rgba(20,184,166,.1)",  border:"rgba(20,184,166,.25)",  color:"#5eead4" },
  Academic: { bg:"rgba(236,72,153,.1)",  border:"rgba(236,72,153,.25)",  color:"#f9a8d4" },
};

function LeaveBadge({ status, size="sm" }) {
  const c = LEAVE_STATUS_CFG[status] || LEAVE_STATUS_CFG.pending;
  const lg = size === "lg";
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:lg?8:6, padding:lg?"6px 14px":"4px 10px", borderRadius:999, background:c.bg, border:`1px solid ${c.border}`, color:c.color, fontSize:lg?13:11, fontWeight:600, fontFamily:"'Syne',sans-serif", letterSpacing:"0.04em", textTransform:"uppercase" }}>
      <span style={{ width:lg?7:6, height:lg?7:6, borderRadius:"50%", background:c.color, boxShadow:`0 0 6px ${c.color}`, flexShrink:0 }} />
      {c.label}
    </span>
  );
}

function LeaveTypePill({ type }) {
  const c = LEAVE_TYPE_CFG[type] || { bg:"rgba(255,255,255,.06)", border:"rgba(255,255,255,.1)", color:"rgba(248,250,252,.6)" };
  return <span style={{ display:"inline-block", padding:"3px 11px", borderRadius:6, background:c.bg, border:`1px solid ${c.border}`, color:c.color, fontSize:11, fontWeight:600, fontFamily:"'Syne',sans-serif", letterSpacing:"0.03em" }}>{type}</span>;
}

const fmtDate = (d) => { try { return new Date(d).toLocaleDateString("en-GB",{ day:"2-digit", month:"short", year:"numeric" }); } catch { return "—"; } };
const daysBetween = (a, b) => Math.max(1, Math.ceil((new Date(b)-new Date(a))/86400000)+1);

// ═══════════════════════════════════════════════════════════════════════════════
// EMBEDDED LEAVE MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════════
function LeaveManagement({ token }) {
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [comment, setComment] = useState("");
  const [actLoading, setActLoading] = useState(false);
  const [lToast, setLToast] = useState(null);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);

  const showLToast = (msg, type="success") => { setLToast({ msg, type }); setTimeout(()=>setLToast(null), 3000); };

  const loadLeaves = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/leaves?status=${encodeURIComponent(statusFilter)}&search=${encodeURIComponent(search)}`, { headers:{ Authorization:`Bearer ${token}` } });
      const data = await res.json();
      setLeaves(data.leaves || []);
    } catch { setLeaves([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadLeaves(); }, [statusFilter]);

  const filtered = useMemo(() => {
    if (!search.trim()) return leaves;
    const q = search.toLowerCase();
    return leaves.filter(l => l.student?.fullName?.toLowerCase().includes(q) || l.student?.email?.toLowerCase().includes(q) || l.leaveType?.toLowerCase().includes(q));
  }, [leaves, search]);

  const counts = useMemo(() => ({
    all: leaves.length,
    pending: leaves.filter(l=>l.status==="pending").length,
    approved: leaves.filter(l=>l.status==="approved").length,
    rejected: leaves.filter(l=>l.status==="rejected").length,
  }), [leaves]);

  const updateStatus = async (id, newStatus) => {
    setActLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/leaves/${id}/status`, {
        method:"PUT", headers:{ "Content-Type":"application/json", Authorization:`Bearer ${token}` },
        body: JSON.stringify({ status: newStatus, adminComment: comment }),
      });
      if (!res.ok) { const d = await res.json(); showLToast(d.message||"Failed","error"); return; }
      showLToast(`Request ${newStatus==="approved"?"approved":"rejected"} successfully.`, newStatus==="approved"?"success":"error");
      setSelected(null); setComment(""); loadLeaves();
    } catch { showLToast("Network error","error"); }
    finally { setActLoading(false); }
  };

  const exportToPDF = async () => {
    if (filtered.length === 0) { showLToast("No records to export.","error"); return; }
    try {
      const jsPDFModule = await import("jspdf");
      const jsPDF = jsPDFModule.default || jsPDFModule.jsPDF || jsPDFModule;
      const autoTableModule = await import("jspdf-autotable");
      const autoTable = autoTableModule.default || autoTableModule;

      const doc = new jsPDF();
      doc.text("Leave Requests Report", 14, 15);
      const headers = [["Student Name", "Email", "Leave Type", "Duration", "Status"]];
      const data = filtered.map(l => [ l.student?.fullName||"-", l.student?.email||"-", l.leaveType||"-", `${daysBetween(l.fromDate,l.toDate)}d (${fmtDate(l.fromDate)})`, l.status ]);
      
      autoTable(doc, { startY: 20, head: headers, body: data });
      doc.save(`leave-requests-${new Date().toISOString().split("T")[0]}.pdf`);
      showLToast("PDF exported successfully.","success");
    } catch (e) { 
      console.error(e);
      showLToast("Export failed.","error"); 
    }
    setExportMenuOpen(false);
  };

  const exportToExcel = async () => {
    if (filtered.length === 0) { showLToast("No records to export.","error"); return; }
    try {
      const XLSX = await import("xlsx");
      const data = filtered.map(l => ({ "Student Name": l.student?.fullName||"-", "Email": l.student?.email||"-", "Leave Type": l.leaveType||"-", "From Date": fmtDate(l.fromDate), "To Date": fmtDate(l.toDate), "Duration": daysBetween(l.fromDate,l.toDate), "Status": l.status, "Reason": l.reason||"-" }));
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Leaves");
      XLSX.writeFile(wb, `leave-requests-${new Date().toISOString().split("T")[0]}.xlsx`);
      showLToast("Excel exported successfully.","success");
    } catch (e) { showLToast("Export failed.","error"); }
    setExportMenuOpen(false);
  };

  const STAT_TABS = [
    { key:"all",      label:"Total",    accent:"#6366f1", acr:"99,102,241"  },
    { key:"pending",  label:"Pending",  accent:"#f59e0b", acr:"245,158,11"  },
    { key:"approved", label:"Approved", accent:"#10b981", acr:"16,185,129"  },
    { key:"rejected", label:"Rejected", accent:"#ef4444", acr:"239,68,68"   },
  ];

  return (
    <div>

      {/* Stat tabs */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:20 }}>
        {STAT_TABS.map(({ key, label, accent, acr }) => (
          <div key={key} onClick={()=>setStatusFilter(key)} style={{ background:statusFilter===key?`rgba(${acr},.08)`:"rgba(255,255,255,.025)", border:`1px solid ${statusFilter===key?`rgba(${acr},.35)`:"rgba(255,255,255,.06)"}`, borderRadius:16, padding:"18px 20px", cursor:"pointer", position:"relative", overflow:"hidden", transition:"all .2s" }}>
            {statusFilter===key && <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,${accent},transparent)` }} />}
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:28, fontWeight:800, color:statusFilter===key?accent:"#f8fafc", letterSpacing:"-.02em", marginBottom:4 }}>{counts[key]}</div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:10, fontWeight:600, textTransform:"uppercase", letterSpacing:".08em", color:"rgba(248,250,252,.3)" }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div style={{ background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 18, overflow: "hidden" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:14, padding:"18px 22px", borderBottom:"1px solid rgba(255,255,255,.05)" }}>
          <div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:700, color:"#f8fafc" }}>Leave Requests</div>
            <div style={{ fontSize:12, color:"rgba(248,250,252,.28)", fontWeight:300, marginTop:2 }}>Search, review and manage student leave applications</div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
            <div style={{ position:"relative" }}>
              <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"rgba(248,250,252,.2)", display:"flex", pointerEvents:"none" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              </span>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search student, email..." onKeyDown={e=>e.key==="Enter"&&loadLeaves()} style={{ padding:"9px 14px 9px 36px", borderRadius:10, background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.07)", color:"#f8fafc", fontSize:13, fontFamily:"'DM Sans',sans-serif", outline:"none", width:200, transition:"all .2s" }} />
            </div>
            
            <div style={{ display:"flex", gap:4 }}>
              {["all","pending","approved","rejected"].map(s=>(
                <button key={s} onClick={()=>setStatusFilter(s)} style={{ padding:"8px 14px", borderRadius:8, border:`1px solid ${statusFilter===s?"rgba(99,102,241,.3)":"rgba(255,255,255,.06)"}`, background:statusFilter===s?"rgba(99,102,241,.1)":"transparent", color:statusFilter===s?"#a5b4fc":"rgba(248,250,252,.35)", fontFamily:"'Syne',sans-serif", fontSize:11, fontWeight:600, letterSpacing:".05em", textTransform:"uppercase", cursor:"pointer", transition:"all .15s" }}>{s}</button>
              ))}
            </div>

            <button onClick={loadLeaves} style={{ padding:"9px 16px", borderRadius:10, border:"1px solid rgba(255,255,255,.07)", background:"rgba(255,255,255,.03)", color:"rgba(248,250,252,.4)", fontFamily:"'Syne',sans-serif", fontSize:11, fontWeight:600, letterSpacing:".05em", textTransform:"uppercase", cursor:"pointer", display:"flex", alignItems:"center", gap:7, transition:"all .2s" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
              {loading ? "Loading..." : "Refresh"}
            </button>
            
            <div style={{ position:"relative" }}>
              <button onClick={() => setExportMenuOpen(!exportMenuOpen)} style={{ padding:"9px 16px", borderRadius:10, border:"none", background:"linear-gradient(135deg,#6366f1,#818cf8)", color:"#fff", fontFamily:"'Syne',sans-serif", fontSize:11, fontWeight:700, letterSpacing:".05em", textTransform:"uppercase", cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Export
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft:2, transition:"transform .2s", transform:exportMenuOpen?"rotate(180deg)":"none" }}><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              {exportMenuOpen && (
                <>
                  <div onClick={() => setExportMenuOpen(false)} style={{ position:"fixed", inset:0, zIndex:90 }} />
                  <div style={{ position:"absolute", top:"100%", right:0, marginTop:8, background:"rgba(13,13,24,.95)", border:"1px solid rgba(255,255,255,.1)", borderRadius:12, padding:6, display:"flex", flexDirection:"column", gap:2, minWidth:160, zIndex:100, boxShadow:"0 10px 40px rgba(0,0,0,.5)", backdropFilter:"blur(10px)", animation:"adFadeIn .15s ease" }}>
                    <button onClick={exportToPDF} style={{ padding:"10px 14px", borderRadius:8, border:"none", background:"transparent", color:"#f8fafc", fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:500, textAlign:"left", cursor:"pointer", transition:"all .15s", display:"flex", alignItems:"center", gap:8 }} onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,.06)"}} onMouseLeave={e=>{e.currentTarget.style.background="transparent"}}>
                      <span style={{ color:"#ef4444" }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg></span>
                      Download PDF
                    </button>
                    <button onClick={exportToExcel} style={{ padding:"10px 14px", borderRadius:8, border:"none", background:"transparent", color:"#f8fafc", fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:500, textAlign:"left", cursor:"pointer", transition:"all .15s", display:"flex", alignItems:"center", gap:8 }} onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,.06)"}} onMouseLeave={e=>{e.currentTarget.style.background="transparent"}}>
                      <span style={{ color:"#10b981" }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="17"/><line x1="8" y1="17" x2="16" y2="13"/></svg></span>
                      Download Excel
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <div style={{ padding:56, textAlign:"center" }}>
            <div style={{ width:26, height:26, border:"2px solid rgba(99,102,241,.2)", borderTopColor:"#6366f1", borderRadius:"50%", animation:"adSpin .7s linear infinite", margin:"0 auto 14px" }} />
            <div style={{ color:"rgba(248,250,252,.25)", fontSize:13 }}>Loading requests...</div>
          </div>
        ) : filtered.length===0 ? (
          <div style={{ padding:"60px 20px", textAlign:"center" }}>
            <div style={{ fontSize:40, marginBottom:14, opacity:.3 }}>📋</div>
          <div style={{ color:"rgba(248,250,252,.2)", fontSize:14, fontWeight:300 }}>No leave requests found</div>
        </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width:"100%", minWidth:800, borderCollapse:"collapse" }}>
              <thead>
                <tr style={{ background:"rgba(255,255,255,.015)" }}>
                  {["Student","Leave Type","From","To","Duration","Status","Action"].map(h=>(
                    <th key={h} style={{ padding:"10px 16px", textAlign:"left", fontFamily:"'Syne',sans-serif", fontSize:10, fontWeight:700, letterSpacing:".1em", textTransform:"uppercase", color:"rgba(248,250,252,.2)", borderBottom:"1px solid rgba(255,255,255,.04)", whiteSpace:"nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(l=>(
                  <tr key={l._id} style={{ borderBottom:"1px solid rgba(255,255,255,.03)", transition:"background .12s" }}>
                    <td style={{ padding:"13px 16px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <Avatar name={l.student?.fullName} />
                        <div>
                          <div style={{ fontWeight:500, fontSize:14, color:"#f1f5f9", marginBottom:2 }}>{l.student?.fullName||"—"}</div>
                          <div style={{ fontSize:11, color:"rgba(248,250,252,.28)", fontWeight:300 }}>{l.student?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding:"13px 16px" }}><LeaveTypePill type={l.leaveType} /></td>
                    <td style={{ padding:"13px 16px", fontSize:12, color:"rgba(248,250,252,.4)" }}>{fmtDate(l.fromDate)}</td>
                    <td style={{ padding:"13px 16px", fontSize:12, color:"rgba(248,250,252,.4)" }}>{fmtDate(l.toDate)}</td>
                    <td style={{ padding:"13px 16px" }}>
                      <span style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:11, color:"rgba(248,250,252,.35)" }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        {daysBetween(l.fromDate,l.toDate)}d
                      </span>
                    </td>
                    <td style={{ padding:"13px 16px" }}><LeaveBadge status={l.status} /></td>
                    <td style={{ padding:"13px 16px" }}>
                      <button onClick={()=>{ setSelected(l); setComment(l.adminComment||""); }} style={{ padding:"7px 15px", borderRadius:8, border:"1px solid rgba(99,102,241,.2)", background:"rgba(99,102,241,.06)", color:"#a5b4fc", fontFamily:"'Syne',sans-serif", fontSize:10, fontWeight:700, letterSpacing:".06em", textTransform:"uppercase", cursor:"pointer", transition:"all .2s", display:"inline-flex", alignItems:"center", gap:6 }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      

      {/* Leave review modal */}
      {selected && (
        <div onClick={()=>setSelected(null)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.72)", backdropFilter:"blur(8px)", display:"flex", alignItems:"center", justifyContent:"center", padding:20, zIndex:200, animation:"adFadeIn .2s ease" }}>
          <div onClick={e=>e.stopPropagation()} style={{ width:"min(760px,100%)", maxHeight:"92vh", overflowY:"auto", background:"#0d0d18", border:"1px solid rgba(255,255,255,.09)", borderRadius:22, boxShadow:"0 40px 100px rgba(0,0,0,.7)", animation:"adSlideUp .28s cubic-bezier(.16,1,.3,1) both" }}>
            {/* Banner */}
            <div style={{ padding:"24px 28px 20px", borderBottom:"1px solid rgba(255,255,255,.05)", position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", top:-40, right:-40, width:200, height:200, background:"radial-gradient(circle,rgba(99,102,241,.12) 0%,transparent 70%)", pointerEvents:"none" }} />
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:16 }}>
                <div>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:800, color:"#f8fafc", marginBottom:10, letterSpacing:"-.01em" }}>Leave Request Review</div>
                  <LeaveBadge status={selected.status} size="lg" />
                </div>
                <button onClick={()=>setSelected(null)} style={{ width:34, height:34, borderRadius:10, border:"1px solid rgba(255,255,255,.07)", background:"rgba(255,255,255,.04)", color:"rgba(248,250,252,.35)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", flexShrink:0, transition:"all .2s" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
                </button>
              </div>
            </div>
            <div style={{ padding:"22px 28px" }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:18 }}>
                <div style={{ background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.06)", borderRadius:13, padding:"14px 16px" }}>
                  <div style={{ fontSize:9, fontWeight:700, letterSpacing:".12em", textTransform:"uppercase", color:"rgba(248,250,252,.22)", fontFamily:"'Syne',sans-serif", marginBottom:10 }}>Student</div>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <Avatar name={selected.student?.fullName} size={40} />
                    <div>
                      <div style={{ fontSize:14, fontWeight:500, color:"#e2e8f0" }}>{selected.student?.fullName}</div>
                      <div style={{ fontSize:11, color:"rgba(248,250,252,.3)", fontWeight:300, marginTop:2 }}>{selected.student?.email}</div>
                      <div style={{ fontSize:11, color:"rgba(248,250,252,.3)", fontWeight:300 }}>{selected.student?.phone}</div>
                    </div>
                  </div>
                </div>
                <div style={{ background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.06)", borderRadius:13, padding:"14px 16px" }}>
                  <div style={{ fontSize:9, fontWeight:700, letterSpacing:".12em", textTransform:"uppercase", color:"rgba(248,250,252,.22)", fontFamily:"'Syne',sans-serif", marginBottom:8 }}>Leave Period</div>
                  <div style={{ fontSize:14, fontWeight:500, color:"#e2e8f0" }}>{fmtDate(selected.fromDate)} → {fmtDate(selected.toDate)}</div>
                  <div style={{ display:"inline-flex", alignItems:"center", gap:6, marginTop:8, background:"rgba(99,102,241,.09)", border:"1px solid rgba(99,102,241,.18)", color:"#a5b4fc", fontSize:11, fontWeight:600, padding:"3px 10px", borderRadius:6, fontFamily:"'Syne',sans-serif" }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    {daysBetween(selected.fromDate, selected.toDate)} day{daysBetween(selected.fromDate,selected.toDate)!==1?"s":""}
                  </div>
                </div>
                <div style={{ background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.06)", borderRadius:13, padding:"14px 16px" }}>
                  <div style={{ fontSize:9, fontWeight:700, letterSpacing:".12em", textTransform:"uppercase", color:"rgba(248,250,252,.22)", fontFamily:"'Syne',sans-serif", marginBottom:8 }}>Leave Type</div>
                  <LeaveTypePill type={selected.leaveType} />
                </div>
                {selected.adminComment && (
                  <div style={{ background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.06)", borderRadius:13, padding:"14px 16px" }}>
                    <div style={{ fontSize:9, fontWeight:700, letterSpacing:".12em", textTransform:"uppercase", color:"rgba(248,250,252,.22)", fontFamily:"'Syne',sans-serif", marginBottom:6 }}>Previous Comment</div>
                    <div style={{ fontSize:13, color:"rgba(248,250,252,.5)", fontWeight:300, fontStyle:"italic", lineHeight:1.5 }}>{selected.adminComment}</div>
                  </div>
                )}
                <div style={{ gridColumn:"1/-1", background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.06)", borderRadius:13, padding:"14px 16px" }}>
                  <div style={{ fontSize:9, fontWeight:700, letterSpacing:".12em", textTransform:"uppercase", color:"rgba(248,250,252,.22)", fontFamily:"'Syne',sans-serif", marginBottom:8 }}>Reason</div>
                  <div style={{ fontSize:13, fontWeight:300, color:"rgba(248,250,252,.65)", lineHeight:1.75 }}>{selected.reason}</div>
                </div>
              </div>
              <div style={{ height:1, background:"rgba(255,255,255,.05)", marginBottom:18 }} />
              <label style={{ fontSize:10, fontWeight:700, letterSpacing:".1em", textTransform:"uppercase", color:"rgba(248,250,252,.22)", fontFamily:"'Syne',sans-serif", display:"block", marginBottom:8 }}>
                Admin Comment <span style={{ color:"rgba(248,250,252,.15)", fontWeight:400, textTransform:"none", letterSpacing:0 }}>(optional)</span>
              </label>
              <textarea value={comment} onChange={e=>setComment(e.target.value)} placeholder="Add feedback for the student..." rows={3} style={{ width:"100%", padding:"12px 14px", background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.07)", borderRadius:12, color:"#f8fafc", fontSize:13, fontFamily:"'DM Sans',sans-serif", fontWeight:300, resize:"vertical", outline:"none", minHeight:88, transition:"all .2s" }} />
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"16px 28px 22px", borderTop:"1px solid rgba(255,255,255,.05)" }}>
              <div style={{ fontSize:11, color:"rgba(248,250,252,.18)", fontWeight:300, display:"flex", alignItems:"center", gap:6 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                Action cannot be undone
              </div>
              <div style={{ display:"flex", gap:10 }}>
                <button disabled={actLoading} onClick={()=>updateStatus(selected._id,"rejected")} style={{ padding:"11px 22px", borderRadius:10, border:"1px solid rgba(239,68,68,.25)", background:"rgba(239,68,68,.07)", color:"#fca5a5", fontFamily:"'Syne',sans-serif", fontSize:11, fontWeight:700, letterSpacing:".06em", textTransform:"uppercase", cursor:"pointer", display:"flex", alignItems:"center", gap:7, opacity:actLoading?.4:1, transition:"all .2s" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
                  Reject
                </button>
                <button disabled={actLoading} onClick={()=>updateStatus(selected._id,"approved")} style={{ padding:"11px 22px", borderRadius:10, border:"none", background:"linear-gradient(135deg,#059669,#10b981)", color:"#fff", fontFamily:"'Syne',sans-serif", fontSize:11, fontWeight:700, letterSpacing:".06em", textTransform:"uppercase", cursor:"pointer", display:"flex", alignItems:"center", gap:7, opacity:actLoading?.4:1, transition:"all .2s" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {lToast && (
        <div style={{ position:"fixed", bottom:90, right:28, zIndex:300, padding:"13px 20px", borderRadius:14, background:lToast.type==="success"?"#071a12":"#1a0707", border:`1px solid ${lToast.type==="success"?"rgba(16,185,129,.3)":"rgba(239,68,68,.3)"}`, color:lToast.type==="success"?"#6ee7b7":"#fca5a5", fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:500, display:"flex", alignItems:"center", gap:10, boxShadow:"0 20px 50px rgba(0,0,0,.5)", animation:"adToastIn .3s cubic-bezier(.16,1,.3,1) both" }}>
          {lToast.type==="success"
            ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>}
          {lToast.msg}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════
export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [viewStudent, setViewStudent] = useState(null);
  const [editStudent, setEditStudent] = useState(null);
  const [deleteStudent, setDeleteStudent] = useState(null);
  const [toast, setToast] = useState({ show:false, type:"success", msg:"" });
  const [sideCollapsed, setSideCollapsed] = useState(false);

  const adminToken = localStorage.getItem("adminToken");
  const adminData = useMemo(() => { try { return JSON.parse(localStorage.getItem("adminData")||"{}"); } catch { return {}; } }, []);
  const axiosConfig = useMemo(() => ({ headers: adminToken ? { Authorization:`Bearer ${adminToken}` } : {} }), [adminToken]);

  const showToast = (type, msg) => { setToast({ show:true, type, msg }); setTimeout(()=>setToast({ show:false, type:"success", msg:"" }), 3000); };

  useEffect(() => { if (!adminToken) navigate("/admin/login"); }, [adminToken, navigate]);
  useEffect(() => { if (activeMenu !== "students") { setViewStudent(null); setEditStudent(null); setDeleteStudent(null); } }, [activeMenu]);

  const handleLogout = () => { localStorage.removeItem("adminToken"); localStorage.removeItem("adminData"); navigate("/admin/login"); };

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/api/admin/students`, { params:{ search }, ...axiosConfig });
      setStudents(res.data?.students || res.data || []);
    } catch (err) {
      if (err?.response?.status===401) { showToast("error","Session expired."); handleLogout(); return; }
      showToast("error", err?.response?.data?.message || err.message || "Failed to load students");
    } finally { setLoading(false); }
  };

  useEffect(() => { if (activeMenu==="students"||activeMenu==="dashboard") fetchStudents(); }, [activeMenu]);
  useEffect(() => { if (activeMenu!=="students") return; const t=setTimeout(()=>fetchStudents(),400); return ()=>clearTimeout(t); }, [search, activeMenu]);

  const formatDate = (d) => { if (!d) return "—"; try { return new Date(d).toLocaleDateString("en-GB",{ day:"2-digit", month:"short", year:"numeric" }); } catch { return "—"; } };

  const getPhotoUrl = (s) => {
    if (!s?.profilePhoto) return "";
    const raw = String(s.profilePhoto).trim();
    if (!raw) return "";
    if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
    let path = raw.replace(/\\/g,"/").replace(/^\.\/+/,"");
    const idx = path.toLowerCase().indexOf("uploads/");
    if (idx !== -1) path = path.slice(idx);
    if (!path.toLowerCase().startsWith("uploads/")) path = `uploads/${path.replace(/^\/+/,"")}`;
    return `${API_BASE}/${path.replace(/^\/+/,"")}`;
  };

  const saveEdit = async () => {
    try {
      if (!editStudent?._id) return; setLoading(true);
      const res = await axios.put(`${API_BASE}/api/admin/students/${editStudent._id}`, { studentId:editStudent.studentId, fullName:editStudent.fullName, email:editStudent.email, phone:editStudent.phone, department:editStudent.department, yearSemester:editStudent.yearSemester, address:editStudent.address }, axiosConfig);
      showToast("success", res.data?.message||"Student updated"); setEditStudent(null); fetchStudents();
    } catch (err) {
      if (err?.response?.status===401) { showToast("error","Session expired."); handleLogout(); return; }
      showToast("error", err?.response?.data?.message||err.message||"Update failed");
    } finally { setLoading(false); }
  };

  const confirmDelete = async () => {
    try {
      if (!deleteStudent?._id) return; setLoading(true);
      const res = await axios.delete(`${API_BASE}/api/admin/students/${deleteStudent._id}`, axiosConfig);
      showToast("success", res.data?.message||"Student deleted"); setDeleteStudent(null); fetchStudents();
    } catch (err) {
      if (err?.response?.status===401) { showToast("error","Session expired."); handleLogout(); return; }
      showToast("error", err?.response?.data?.message||err.message||"Delete failed");
    } finally { setLoading(false); }
  };

  const toggleActive = async (student) => {
    try {
      setLoading(true);
      const newStatus = !(student.isActive !== false);
      const res = await axios.patch(`${API_BASE}/api/admin/students/${student._id}/status`, { isActive: newStatus }, axiosConfig);
      showToast("success", res.data?.message||(newStatus?"Student activated":"Student deactivated")); fetchStudents();
    } catch (err) {
      if (err?.response?.status===401) { showToast("error","Session expired."); handleLogout(); return; }
      showToast("error", err?.response?.data?.message||err.message||"Status change failed");
    } finally { setLoading(false); }
  };

  const activeCount  = students.filter(s=>s.isActive!==false).length;
  const blockedCount = students.filter(s=>s.isActive===false).length;
  const deptCount    = [...new Set(students.map(s=>s.department).filter(Boolean))].length;

  const pageMeta = useMemo(() => ({
    dashboard:{ title:"Dashboard Overview", sub:"Overview"            },
    students: { title:"Student Management", sub:"Students · Records"  },
    leaves:   { title:"Leave Management",   sub:"Leaves · Requests"   },
  }[activeMenu] || { title:"Admin Panel", sub:"" }), [activeMenu]);

  const NAV_GROUPS = [
    { section:"Overview", items:[
      { key:"dashboard", label:"Dashboard", icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg> },
    ]},
    { section:"Management", items:[
      { key:"students", label:"Students",    icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
      { key:"leaves",   label:"Leave Mgmt", icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
    ]},
    { section:"System", items:[
      { key:"__web", label:"Go to Website", icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>, action:()=>navigate("/") },
    ]},
  ];

  // ─── Dashboard content ────────────────────────────────────────────────────
  const DashboardContent = () => (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      {/* 4 wide stat cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
        {[
          { label:"Total Students",   value:students.length, accent:"#6366f1", acr:"99,102,241",  icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
          { label:"Active Accounts",  value:activeCount,     accent:"#10b981", acr:"16,185,129",  icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> },
          { label:"Blocked Accounts", value:blockedCount,    accent:"#ef4444", acr:"239,68,68",   icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg> },
          { label:"Departments",      value:deptCount,       accent:"#f59e0b", acr:"245,158,11",  icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
        ].map(({ label, value, accent, acr, icon }) => (
          <div key={label} style={{ background:"rgba(255,255,255,.025)", border:"1px solid rgba(255,255,255,.06)", borderRadius:18, padding:"22px 24px", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,${accent},transparent)` }} />
            <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:14 }}>
              <div style={{ width:44, height:44, borderRadius:13, background:`rgba(${acr},.12)`, display:"flex", alignItems:"center", justifyContent:"center", color:accent }}>{icon}</div>
              <span style={{ fontSize:11, color:"rgba(248,250,252,.2)", fontFamily:"'Syne',sans-serif", fontWeight:600 }}>All time</span>
            </div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:36, fontWeight:800, color:"#f8fafc", letterSpacing:"-.02em", lineHeight:1, marginBottom:6 }}>{value}</div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:11, fontWeight:600, textTransform:"uppercase", letterSpacing:".08em", color:"rgba(248,250,252,.3)" }}>{label}</div>
          </div>
        ))}
      </div>

      {/* 2-col lower section: recent students + right panel */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>

        {/* Recent students list */}
        <div style={{ background:"rgba(255,255,255,.02)", border:"1px solid rgba(255,255,255,.06)", borderRadius:18, overflow:"hidden" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 20px", borderBottom:"1px solid rgba(255,255,255,.05)" }}>
            <div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:14, color:"#f8fafc" }}>Recent Students</div>
              <div style={{ fontSize:11, color:"rgba(248,250,252,.28)", fontWeight:300, marginTop:2 }}>Latest registrations</div>
            </div>
            <button onClick={()=>setActiveMenu("students")} style={{ padding:"6px 14px", borderRadius:8, border:"1px solid rgba(99,102,241,.25)", background:"rgba(99,102,241,.08)", color:"#a5b4fc", fontFamily:"'Syne',sans-serif", fontSize:10, fontWeight:700, letterSpacing:".06em", textTransform:"uppercase", cursor:"pointer" }}>View All</button>
          </div>
          <div>
            {students.slice(0,6).map(s=>(
              <div key={s._id} style={{ display:"flex", alignItems:"center", gap:12, padding:"11px 20px", borderBottom:"1px solid rgba(255,255,255,.03)", transition:"background .12s", cursor:"default" }} onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,.02)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <Avatar name={s.fullName} src={getPhotoUrl(s)} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:500, fontSize:13, color:"#f1f5f9", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{s.fullName||"—"}</div>
                  <div style={{ fontSize:11, color:"rgba(248,250,252,.28)", fontWeight:300, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{s.department||s.email||"—"}</div>
                </div>
                <StatusPill active={s.isActive!==false} />
              </div>
            ))}
            {students.length===0 && <div style={{ padding:"28px 20px", textAlign:"center", color:"rgba(248,250,252,.2)", fontSize:13 }}>No students yet</div>}
          </div>
        </div>

        {/* Right column */}
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

          {/* Quick access */}
          <div style={{ background:"rgba(255,255,255,.02)", border:"1px solid rgba(255,255,255,.06)", borderRadius:18, padding:"18px 20px" }}>
            <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:14, color:"#f8fafc", marginBottom:4 }}>Quick Access</div>
            <div style={{ fontSize:11, color:"rgba(248,250,252,.28)", fontWeight:300, marginBottom:16 }}>Jump to any management module</div>
            <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
              {[
                { key:"students", label:"Student Management",  desc:"View & manage student accounts",      accent:"#6366f1", acr:"99,102,241" },
                { key:"leaves",   label:"Leave Requests",      desc:"Review & process leave applications", accent:"#10b981", acr:"16,185,129" },
              ].map(({ key, label, desc, accent, acr }) => (
                <div key={key} onClick={()=>setActiveMenu(key)} style={{ display:"flex", alignItems:"center", gap:14, padding:"13px 14px", background:`rgba(${acr},.05)`, border:`1px solid rgba(${acr},.12)`, borderRadius:12, cursor:"pointer", transition:"all .2s" }}
                  onMouseEnter={e=>{ e.currentTarget.style.background=`rgba(${acr},.1)`; e.currentTarget.style.borderColor=`rgba(${acr},.25)`; }}
                  onMouseLeave={e=>{ e.currentTarget.style.background=`rgba(${acr},.05)`; e.currentTarget.style.borderColor=`rgba(${acr},.12)`; }}>
                  <div style={{ width:36, height:36, borderRadius:10, background:`rgba(${acr},.12)`, display:"flex", alignItems:"center", justifyContent:"center", color:accent, flexShrink:0 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                  </div>
                  <div>
                    <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:13, color:"#f8fafc" }}>{label}</div>
                    <div style={{ fontSize:11, color:"rgba(248,250,252,.3)", fontWeight:300, marginTop:2 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Account breakdown bars */}
          <div style={{ background:"rgba(255,255,255,.02)", border:"1px solid rgba(255,255,255,.06)", borderRadius:18, padding:"18px 20px", flex:1 }}>
            <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:14, color:"#f8fafc", marginBottom:18 }}>Account Breakdown</div>
            {[
              { label:"Active",  value:activeCount,  total:students.length, accent:"#10b981", acr:"16,185,129" },
              { label:"Blocked", value:blockedCount,  total:students.length, accent:"#ef4444", acr:"239,68,68"  },
            ].map(({ label, value, total, accent }) => {
              const pct = total > 0 ? Math.round((value/total)*100) : 0;
              return (
                <div key={label} style={{ marginBottom:18 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:7 }}>
                    <span style={{ fontSize:12, color:"rgba(248,250,252,.4)", fontWeight:400 }}>{label}</span>
                    <span style={{ fontFamily:"'Syne',sans-serif", fontSize:12, fontWeight:700, color:accent }}>{value} <span style={{ color:"rgba(248,250,252,.2)", fontWeight:400 }}>({pct}%)</span></span>
                  </div>
                  <div style={{ height:7, borderRadius:999, background:"rgba(255,255,255,.06)", overflow:"hidden" }}>
                    <div style={{ height:"100%", width:`${pct}%`, background:`linear-gradient(90deg,${accent},${accent}88)`, borderRadius:999, transition:"width .6s ease" }} />
                  </div>
                </div>
              );
            })}
            {/* welcome note at bottom */}
            <div style={{ marginTop:10, padding:"12px 14px", background:"rgba(99,102,241,.06)", border:"1px solid rgba(99,102,241,.12)", borderRadius:10 }}>
              <div style={{ fontSize:12, color:"rgba(248,250,252,.4)", fontWeight:300, lineHeight:1.6 }}>
                👋 Welcome back, <span style={{ color:"#a5b4fc", fontWeight:600 }}>{adminData?.name||"Admin"}</span>. Use the sidebar to manage your students and leave requests.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ─── Students content ─────────────────────────────────────────────────────
  const StudentsContent = () => (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginBottom:20 }}>
        {[
          { label:"Total",   value:students.length, accent:"#6366f1", acr:"99,102,241" },
          { label:"Active",  value:activeCount,     accent:"#10b981", acr:"16,185,129" },
          { label:"Blocked", value:blockedCount,    accent:"#ef4444", acr:"239,68,68"  },
        ].map(({ label, value, accent, acr }) => (
          <div key={label} style={{ background:"rgba(255,255,255,.025)", border:"1px solid rgba(255,255,255,.06)", borderRadius:16, padding:"18px 20px", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,${accent},transparent)` }} />
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:28, fontWeight:800, color:"#f8fafc", marginBottom:4 }}>{value}</div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:10, fontWeight:600, textTransform:"uppercase", letterSpacing:".08em", color:"rgba(248,250,252,.3)" }}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{ background:"rgba(255,255,255,.02)", border:"1px solid rgba(255,255,255,.06)", borderRadius:18, overflow:"hidden" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:14, padding:"18px 22px", borderBottom:"1px solid rgba(255,255,255,.05)" }}>
          <div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:700, color:"#f8fafc" }}>All Students</div>
            <div style={{ fontSize:12, color:"rgba(248,250,252,.28)", fontWeight:300, marginTop:2 }}>Search, view, edit, activate or remove student accounts</div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
            <div style={{ position:"relative" }}>
              <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"rgba(248,250,252,.2)", display:"flex", pointerEvents:"none" }}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg></span>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name, email, ID..." style={{ padding:"9px 14px 9px 36px", borderRadius:10, background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.07)", color:"#f8fafc", fontSize:13, fontFamily:"'DM Sans',sans-serif", outline:"none", width:240, transition:"all .2s" }} />
            </div>
            <button onClick={fetchStudents} style={{ padding:"9px 16px", borderRadius:10, border:"1px solid rgba(255,255,255,.07)", background:"rgba(255,255,255,.03)", color:"rgba(248,250,252,.4)", fontFamily:"'Syne',sans-serif", fontSize:11, fontWeight:600, letterSpacing:".05em", textTransform:"uppercase", cursor:"pointer", display:"flex", alignItems:"center", gap:7, transition:"all .2s" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
              {loading?"Loading...":"Refresh"}
            </button>
          </div>
        </div>

        {loading && students.length===0 ? (
          <div style={{ padding:56, textAlign:"center" }}>
            <div style={{ width:26, height:26, border:"2px solid rgba(99,102,241,.2)", borderTopColor:"#6366f1", borderRadius:"50%", animation:"adSpin .7s linear infinite", margin:"0 auto 14px" }} />
            <div style={{ fontSize:13, color:"rgba(248,250,252,.25)" }}>Loading students...</div>
          </div>
        ) : students.length===0 ? (
          <div style={{ padding:"60px 20px", textAlign:"center" }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom:14, opacity:.3, color:"#f8fafc" }}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
            <div style={{ fontSize:14, color:"rgba(248,250,252,.2)", fontWeight:300 }}>No students found</div>
          </div>
        ) : (
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead>
                <tr style={{ background:"rgba(255,255,255,.015)" }}>
                  {["Student","Email","Phone","Department","Year / Sem","Status","Actions"].map(h=>(
                    <th key={h} style={{ padding:"10px 16px", textAlign:"left", fontFamily:"'Syne',sans-serif", fontSize:10, fontWeight:700, letterSpacing:".1em", textTransform:"uppercase", color:"rgba(248,250,252,.2)", borderBottom:"1px solid rgba(255,255,255,.04)", whiteSpace:"nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.map(s => {
                  const isActive = s.isActive !== false;
                  return (
                    <tr key={s._id} style={{ borderBottom:"1px solid rgba(255,255,255,.03)", transition:"background .12s" }}>
                      <td style={{ padding:"13px 16px" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:11 }}>
                          <Avatar name={s.fullName} src={getPhotoUrl(s)} />
                          <div>
                            <div style={{ fontWeight:500, fontSize:14, color:"#f1f5f9", marginBottom:2 }}>{s.fullName||"—"}</div>
                            <div style={{ fontSize:11, color:"rgba(248,250,252,.25)", fontWeight:300 }}>{s.studentId||"—"} · {formatDate(s.createdAt)}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding:"13px 16px", fontSize:13, color:"rgba(248,250,252,.4)", fontWeight:300 }}>{s.email||"—"}</td>
                      <td style={{ padding:"13px 16px", fontSize:12, color:"rgba(248,250,252,.4)", fontFamily:"'DM Mono',monospace" }}>{s.phone||"—"}</td>
                      <td style={{ padding:"13px 16px", fontSize:13, color:"rgba(248,250,252,.4)", fontWeight:300 }}>{s.department||"—"}</td>
                      <td style={{ padding:"13px 16px", fontSize:13, color:"rgba(248,250,252,.4)", fontWeight:300 }}>{s.yearSemester||"—"}</td>
                      <td style={{ padding:"13px 16px" }}><StatusPill active={isActive} /></td>
                      <td style={{ padding:"13px 16px" }}>
                        <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                          {[
                            { label:"View",               ac:"99,102,241", col:"#a5b4fc", fn:()=>setViewStudent(s) },
                            { label:"Edit",               ac:"245,158,11", col:"#fcd34d", fn:()=>setEditStudent({ _id:s._id, studentId:s.studentId||"", fullName:s.fullName||"", email:s.email||"", phone:s.phone||"", department:s.department||"", yearSemester:s.yearSemester||"", address:s.address||"", isActive:s.isActive!==false }) },
                            { label:isActive?"Block":"Activate", ac:isActive?"239,68,68":"16,185,129", col:isActive?"#fca5a5":"#6ee7b7", fn:()=>toggleActive(s) },
                            { label:"Delete",             ac:"239,68,68",  col:"#fca5a5", fn:()=>setDeleteStudent(s) },
                          ].map(({ label, ac, col, fn }) => (
                            <button key={label} onClick={fn} style={{ padding:"5px 11px", borderRadius:7, border:`1px solid rgba(${ac},.25)`, background:`rgba(${ac},.07)`, color:col, fontFamily:"'Syne',sans-serif", fontSize:10, fontWeight:700, letterSpacing:".04em", textTransform:"uppercase", cursor:"pointer", transition:"all .15s", whiteSpace:"nowrap" }}>{label}</button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600&family=DM+Mono:wght@400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        html,body{height:100%;overflow-x:hidden;}
        ::-webkit-scrollbar{width:4px;height:4px;}
        ::-webkit-scrollbar-track{background:transparent;}
        ::-webkit-scrollbar-thumb{background:rgba(99,102,241,.3);border-radius:4px;}
        @keyframes adToastIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes adFadeIn{from{opacity:0}to{opacity:1}}
        @keyframes adSlideUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
        @keyframes adSpin{to{transform:rotate(360deg)}}
        @keyframes adBlink{0%,100%{opacity:1}50%{opacity:.3}}

        .ad-shell{display:flex;min-height:100vh;background:#07070e;font-family:'DM Sans',sans-serif;position:relative;overflow:hidden;}
        .ad-shell::before{content:'';position:fixed;inset:0;pointer-events:none;z-index:0;background-image:linear-gradient(rgba(255,255,255,.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.018) 1px,transparent 1px);background-size:60px 60px;}
        .ad-shell::after{content:'';position:fixed;top:-200px;right:-200px;width:700px;height:700px;pointer-events:none;z-index:0;background:radial-gradient(circle,rgba(99,102,241,.07) 0%,transparent 65%);}

        .ad-sb{width:240px;flex-shrink:0;background:rgba(9,9,16,.97);border-right:1px solid rgba(255,255,255,.06);display:flex;flex-direction:column;position:fixed;left:0;top:0;bottom:0;z-index:20;transition:width .25s cubic-bezier(.16,1,.3,1);backdrop-filter:blur(20px);}
        .ad-sb.col{width:64px;}
        .ad-sb-brand{padding:20px 16px 18px;border-bottom:1px solid rgba(255,255,255,.05);display:flex;align-items:center;gap:11px;overflow:hidden;flex-shrink:0;}
        .ad-sb-logo{width:38px;height:38px;border-radius:11px;flex-shrink:0;background:linear-gradient(135deg,#6366f1,#818cf8);display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-weight:800;font-size:16px;color:#fff;box-shadow:0 4px 16px rgba(99,102,241,.35);}
        .ad-sb-bname{font-family:'Syne',sans-serif;font-weight:800;font-size:14px;color:#f8fafc;white-space:nowrap;letter-spacing:-.01em;}
        .ad-sb-bsub{font-size:10px;color:rgba(248,250,252,.3);white-space:nowrap;margin-top:1px;letter-spacing:.04em;text-transform:uppercase;}
        .ad-col-btn{width:24px;height:24px;border-radius:6px;flex-shrink:0;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.04);color:rgba(248,250,252,.3);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .2s;}
        .ad-col-btn:hover{background:rgba(255,255,255,.08);color:rgba(248,250,252,.7);}

        .ad-sb-nav{flex:1;padding:14px 10px;overflow-y:auto;overflow-x:hidden;}
        .ad-nav-sec{font-size:9px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:rgba(248,250,252,.18);font-family:'Syne',sans-serif;padding:10px 8px 6px;white-space:nowrap;overflow:hidden;transition:opacity .2s;}
        .ad-sb.col .ad-nav-sec{opacity:0;pointer-events:none;}
        .ad-nav-item{display:flex;align-items:center;gap:11px;padding:9px 10px;border-radius:10px;cursor:pointer;transition:all .15s;margin-bottom:2px;border:1px solid transparent;overflow:hidden;}
        .ad-nav-item:hover{background:rgba(255,255,255,.04);}
        .ad-nav-item.active{background:rgba(99,102,241,.1);border-color:rgba(99,102,241,.22);}
        .ad-nav-ico{width:32px;height:32px;border-radius:8px;flex-shrink:0;display:flex;align-items:center;justify-content:center;color:rgba(248,250,252,.3);transition:all .15s;}
        .ad-nav-item.active .ad-nav-ico,.ad-nav-item:hover .ad-nav-ico{color:#818cf8;}
        .ad-nav-lbl{font-family:'Syne',sans-serif;font-size:13px;font-weight:600;color:rgba(248,250,252,.4);white-space:nowrap;transition:all .15s;}
        .ad-nav-item.active .ad-nav-lbl{color:#a5b4fc;}
        .ad-nav-item:hover .ad-nav-lbl{color:rgba(248,250,252,.7);}
        .ad-sb.col .ad-nav-lbl{opacity:0;pointer-events:none;}
        .ad-nav-dot{width:6px;height:6px;border-radius:50%;background:#6366f1;box-shadow:0 0 6px #6366f1;animation:adBlink 2s infinite;margin-left:auto;flex-shrink:0;}
        .ad-sb.col .ad-nav-dot{display:none;}

        .ad-sb-footer{padding:14px 10px;border-top:1px solid rgba(255,255,255,.05);flex-shrink:0;}
        .ad-admin-card{display:flex;align-items:center;gap:10px;padding:10px;border-radius:12px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);overflow:hidden;}
        .ad-admin-av{width:34px;height:34px;border-radius:10px;flex-shrink:0;background:linear-gradient(135deg,#6366f1,#818cf8);display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-weight:700;font-size:13px;color:#fff;}
        .ad-admin-name{font-family:'Syne',sans-serif;font-weight:700;font-size:13px;color:#f8fafc;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
        .ad-admin-role{font-size:10px;color:rgba(248,250,252,.3);text-transform:uppercase;letter-spacing:.06em;white-space:nowrap;}

        .ad-main{flex:1;min-width:0;margin-left:240px;display:flex;flex-direction:column;min-height:100vh;position:relative;z-index:1;transition:margin-left .25s cubic-bezier(.16,1,.3,1);}
        .ad-main.col{margin-left:64px;}

        .ad-topbar{height:62px;padding:0 28px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,.05);background:rgba(7,7,14,.85);backdrop-filter:blur(20px);position:sticky;top:0;z-index:10;flex-shrink:0;}
        .ad-page-title{font-family:'Syne',sans-serif;font-size:15px;font-weight:700;color:#f8fafc;letter-spacing:-.01em;}
        .ad-breadcrumb{font-size:11px;color:rgba(248,250,252,.25);font-weight:300;display:flex;align-items:center;gap:5px;margin-top:2px;}
        .ad-topbar-right{display:flex;align-items:center;gap:8px;}
        .ad-icon-btn{width:34px;height:34px;border-radius:9px;border:1px solid rgba(255,255,255,.07);background:rgba(255,255,255,.03);color:rgba(248,250,252,.4);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .2s;}
        .ad-icon-btn:hover{background:rgba(255,255,255,.07);color:rgba(248,250,252,.7);}
        .ad-logout-btn{padding:8px 16px;border-radius:9px;border:1px solid rgba(239,68,68,.2);background:rgba(239,68,68,.06);color:#fca5a5;font-family:'Syne',sans-serif;font-size:11px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;cursor:pointer;transition:all .2s;display:flex;align-items:center;gap:7px;}
        .ad-logout-btn:hover{background:rgba(239,68,68,.14);border-color:rgba(239,68,68,.4);}
        .ad-online-dot{width:8px;height:8px;border-radius:50%;background:#10b981;box-shadow:0 0 8px rgba(16,185,129,.6);animation:adBlink 2s infinite;}

        /* ✅ FIX: .ad-page now uses flex-column layout so Leave Management can stretch to fill height */
        .ad-page{padding:26px 28px;flex:1;overflow-y:auto;width:100%;max-width:100%;min-width:0;display:flex;flex-direction:column;}

        .ad-overlay{position:fixed;inset:0;background:rgba(0,0,0,.7);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;padding:20px;z-index:100;animation:adFadeIn .2s ease;}
        .ad-modal{width:min(680px,100%);max-height:92vh;overflow-y:auto;background:#0d0d18;border:1px solid rgba(255,255,255,.09);border-radius:22px;box-shadow:0 40px 100px rgba(0,0,0,.7);animation:adSlideUp .28s cubic-bezier(.16,1,.3,1) both;}
        .ad-modal-sm{width:min(420px,100%);}
        .ad-modal-hd{display:flex;justify-content:space-between;align-items:center;padding:22px 26px 18px;border-bottom:1px solid rgba(255,255,255,.05);}
        .ad-modal-title{font-family:'Syne',sans-serif;font-size:18px;font-weight:800;color:#f8fafc;letter-spacing:-.01em;}
        .ad-modal-sub{font-size:12px;color:rgba(248,250,252,.28);margin-top:3px;}
        .ad-close-btn{width:34px;height:34px;border-radius:10px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.04);color:rgba(248,250,252,.35);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .2s;flex-shrink:0;}
        .ad-close-btn:hover{background:rgba(255,255,255,.08);color:#f8fafc;}
        .ad-modal-body{padding:22px 26px;}
        .ad-modal-footer{display:flex;justify-content:flex-end;gap:10px;padding:16px 26px 22px;border-top:1px solid rgba(255,255,255,.05);}
        .ad-info-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
        .ad-info-row{display:flex;flex-direction:column;gap:3px;padding:12px 14px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:11px;}
        .ad-info-full{grid-column:1/-1;}
        .ad-info-lbl{font-size:9px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:rgba(248,250,252,.22);font-family:'Syne',sans-serif;}
        .ad-info-val{font-size:14px;font-weight:400;color:#e2e8f0;line-height:1.5;}
        .ad-form-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
        .ad-form-full{grid-column:1/-1;}
        .ad-field{display:flex;flex-direction:column;gap:7px;}
        .ad-field-lbl{font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(248,250,252,.25);font-family:'Syne',sans-serif;}
        .ad-field-inp{padding:10px 14px;border-radius:10px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);color:#f8fafc;font-size:13px;font-family:'DM Sans',sans-serif;outline:none;transition:all .2s;}
        .ad-field-inp:focus{border-color:rgba(99,102,241,.45);background:rgba(99,102,241,.06);box-shadow:0 0 0 3px rgba(99,102,241,.1);}
        .ad-field-inp::placeholder{color:rgba(248,250,252,.2);}
        .ad-btn-primary{padding:11px 22px;border-radius:10px;border:none;background:linear-gradient(135deg,#6366f1,#818cf8);color:#fff;font-family:'Syne',sans-serif;font-size:12px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;cursor:pointer;transition:all .2s;display:flex;align-items:center;gap:7px;}
        .ad-btn-primary:hover{transform:translateY(-1px);box-shadow:0 8px 24px rgba(99,102,241,.35);}
        .ad-btn-primary:disabled{opacity:.4;cursor:not-allowed;transform:none;}
        .ad-btn-danger{padding:11px 22px;border-radius:10px;border:none;background:linear-gradient(135deg,#dc2626,#ef4444);color:#fff;font-family:'Syne',sans-serif;font-size:12px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;cursor:pointer;transition:all .2s;}
        .ad-btn-danger:hover{transform:translateY(-1px);box-shadow:0 8px 24px rgba(239,68,68,.35);}
        .ad-btn-cancel{padding:11px 22px;border-radius:10px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.03);color:rgba(248,250,252,.45);font-family:'Syne',sans-serif;font-size:12px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;cursor:pointer;transition:all .2s;}
        .ad-btn-cancel:hover{background:rgba(255,255,255,.06);color:rgba(248,250,252,.7);}
        .ad-del-warn{padding:18px;border-radius:14px;margin-bottom:20px;background:rgba(239,68,68,.06);border:1px solid rgba(239,68,68,.18);display:flex;gap:14px;align-items:flex-start;}
        .ad-del-ico{width:40px;height:40px;border-radius:12px;flex-shrink:0;background:rgba(239,68,68,.12);display:flex;align-items:center;justify-content:center;color:#f87171;}
        .ad-profile-banner{display:flex;align-items:center;gap:16px;padding:18px 22px;border-bottom:1px solid rgba(255,255,255,.05);background:rgba(99,102,241,.04);}
        @media(max-width:900px){.ad-sb{transform:translateX(-100%);}.ad-main{margin-left:0!important;}}
      `}</style>

      <div className="ad-shell">

        {/* SIDEBAR */}
        <aside className={`ad-sb${sideCollapsed?" col":""}`}>
          <div className="ad-sb-brand">
            <div className="ad-sb-logo">U</div>
            <div style={{ overflow:"hidden", flex:1 }}>
              <div className="ad-sb-bname">UniStay</div>
              <div className="ad-sb-bsub">SLIIT Malabe</div>
            </div>
            <button className="ad-col-btn" onClick={()=>setSideCollapsed(!sideCollapsed)}>
              {sideCollapsed
                ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                : <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>}
            </button>
          </div>

          <nav className="ad-sb-nav">
            {NAV_GROUPS.map(({ section, items }) => (
              <div key={section}>
                <div className="ad-nav-sec">{section}</div>
                {items.map(({ key, label, icon, action }) => (
                  <div key={key} className={`ad-nav-item${activeMenu===key?" active":""}`} onClick={action||(()=>setActiveMenu(key))}>
                    <div className="ad-nav-ico">{icon}</div>
                    <span className="ad-nav-lbl">{label}</span>
                    {activeMenu===key && <span className="ad-nav-dot" />}
                  </div>
                ))}
              </div>
            ))}
          </nav>

          <div className="ad-sb-footer">
            <div className="ad-admin-card">
              <div className="ad-admin-av">{(adminData?.name||"A")[0].toUpperCase()}</div>
              <div style={{ overflow:"hidden", flex:1 }}>
                <div className="ad-admin-name">{adminData?.name||"Administrator"}</div>
                <div className="ad-admin-role">Super Admin</div>
              </div>
            </div>
          </div>
        </aside>


        {/* MAIN */}
        <div className={`ad-main${sideCollapsed?" col":""}`}>
          <header className="ad-topbar">
            <div>
              <div className="ad-page-title">{pageMeta.title}</div>
              <div className="ad-breadcrumb">
                <span>Admin</span><span style={{ color:"rgba(248,250,252,.12)" }}>›</span><span>{pageMeta.sub}</span>
              </div>
            </div>
            <div className="ad-topbar-right">
              <div className="ad-online-dot" title="System online" />
              <button className="ad-icon-btn" title="Notifications">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              </button>
              <button className="ad-icon-btn" title="Settings">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              </button>
              <button className="ad-logout-btn" onClick={handleLogout}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                Logout
              </button>
            </div>
          </header>

          <div className="ad-page">
            {activeMenu==="dashboard" && <DashboardContent />}
            {activeMenu==="students"  && <StudentsContent />}
            {activeMenu==="leaves"    && <LeaveManagement token={adminToken} />}
          </div>
        </div>
      </div>



      {/* VIEW MODAL */}
      {viewStudent && (
        <div className="ad-overlay" onClick={()=>setViewStudent(null)}>
          <div className="ad-modal" onClick={e=>e.stopPropagation()}>
            <div className="ad-profile-banner">
              <Avatar name={viewStudent.fullName} src={getPhotoUrl(viewStudent)} size={52} />
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:18, color:"#f8fafc", marginBottom:4 }}>{viewStudent.fullName||"—"}</div>
                <StatusPill active={viewStudent.isActive!==false} />
              </div>
              <button className="ad-close-btn" onClick={()=>setViewStudent(null)}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>
            </div>
            <div className="ad-modal-body">
              <div className="ad-info-grid">
                {[
                  { label:"Student ID", value:viewStudent.studentId||"—" },
                  { label:"Email",      value:viewStudent.email||"—" },
                  { label:"Phone",      value:viewStudent.phone||"—" },
                  { label:"Department", value:viewStudent.department||"—" },
                  { label:"Year / Sem", value:viewStudent.yearSemester||"—" },
                  { label:"Joined",     value:formatDate(viewStudent.createdAt) },
                  { label:"Address",    value:viewStudent.address||"—", full:true },
                ].map(({ label, value, full }) => (
                  <div key={label} className={`ad-info-row${full?" ad-info-full":""}`}>
                    <span className="ad-info-lbl">{label}</span>
                    <span className="ad-info-val">{value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="ad-modal-footer">
              <button className="ad-btn-cancel" onClick={()=>setViewStudent(null)}>Close</button>
              <button className="ad-btn-primary" onClick={()=>{ setViewStudent(null); setEditStudent({ _id:viewStudent._id, studentId:viewStudent.studentId||"", fullName:viewStudent.fullName||"", email:viewStudent.email||"", phone:viewStudent.phone||"", department:viewStudent.department||"", yearSemester:viewStudent.yearSemester||"", address:viewStudent.address||"", isActive:viewStudent.isActive!==false }); }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                Edit Student
              </button>
            </div>
          </div>
        </div>
      )}



      {/* EDIT MODAL */}
      {editStudent && (
        <div className="ad-overlay" onClick={()=>setEditStudent(null)}>
          <div className="ad-modal" onClick={e=>e.stopPropagation()}>
            <div className="ad-modal-hd">
              <div><div className="ad-modal-title">Edit Student</div><div className="ad-modal-sub">Update student account details</div></div>
              <button className="ad-close-btn" onClick={()=>setEditStudent(null)}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>
            </div>
            <div className="ad-modal-body">
              <div className="ad-form-grid">
                {[
                  { label:"Student ID",  key:"studentId",   full:false, ph:"IT23139312", type:"text" },
                  { label:"Full Name",   key:"fullName",    full:false, ph:"Full name", type:"text"  },
                  { label:"Email",       key:"email",       full:false, ph:"email@uni.lk", type:"text"  },
                  { label:"Phone",       key:"phone",       full:false, ph:"+94 77 000 0000", type:"text"  },
                  { label:"Department",  key:"department",  full:false, type:"select", options:["Computing / IT","Business","Engineering","Humanities & Sciences","Architecture"]   },
                  { label:"Year / Sem",  key:"yearSemester",full:false, ph:"Year 1 Semester 1", type:"text"  },
                  { label:"Address",     key:"address",     full:true,  ph:"Street, City...", type:"text"  },
                ].map(({ label, key, full, ph, type, options }) => (
                  <div key={key} className={`ad-field${full?" ad-form-full":""}`}>
                    <label className="ad-field-lbl">{label}</label>
                    {type === "select" ? (
                      <select className="ad-field-inp" value={editStudent[key]||""} onChange={e=>setEditStudent(p=>({...p,[key]:e.target.value}))} style={{ padding:"12px 16px", borderRadius:10, background:"rgba(13,13,24,.95)", border:"1px solid rgba(255,255,255,.07)", color:"#f8fafc", fontFamily:"'DM Sans',sans-serif", fontSize:13, outline:"none", width:"100%", cursor:"pointer", transition:"all .2s", appearance:"none" }}>
                        <option value="" disabled>Select {label}</option>
                        {options.map(o=><option key={o} value={o}>{o}</option>)}
                      </select>
                    ) : (
                      <input className="ad-field-inp" value={editStudent[key]||""} onChange={e=>setEditStudent(p=>({...p,[key]:e.target.value}))} placeholder={ph} />
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="ad-modal-footer">
              <button className="ad-btn-cancel" onClick={()=>setEditStudent(null)}>Cancel</button>
              <button className="ad-btn-primary" onClick={saveEdit} disabled={loading}>
                {loading?"Saving...":<><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Save Changes</>}
              </button>
            </div>
          </div>
        </div>
      )}




      {/* DELETE MODAL */}
      {deleteStudent && (
        <div className="ad-overlay" onClick={()=>setDeleteStudent(null)}>
          <div className="ad-modal ad-modal-sm" onClick={e=>e.stopPropagation()}>
            <div className="ad-modal-hd">
              <div><div className="ad-modal-title">Delete Student</div><div className="ad-modal-sub">This action is permanent</div></div>
              <button className="ad-close-btn" onClick={()=>setDeleteStudent(null)}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>
            </div>
            <div className="ad-modal-body">
              <div className="ad-del-warn">
                <div className="ad-del-ico"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg></div>
                <div>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:14, color:"#fca5a5", marginBottom:4 }}>{deleteStudent.fullName}</div>
                  <div style={{ fontSize:13, color:"rgba(248,250,252,.55)", fontWeight:300, lineHeight:1.6 }}>This will permanently delete the student account and all associated data. This cannot be undone.</div>
                </div>
              </div>
            </div>
            <div className="ad-modal-footer">
              <button className="ad-btn-cancel" onClick={()=>setDeleteStudent(null)}>Cancel</button>
              <button className="ad-btn-danger" onClick={confirmDelete} disabled={loading}>{loading?"Deleting...":"Delete Permanently"}</button>
            </div>
          </div>
        </div>
      )}

      <Toast toast={toast} />
    </>
  );
}