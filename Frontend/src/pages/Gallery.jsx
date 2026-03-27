import React, { useEffect, useState, useCallback } from "react";

const API_BASE = "http://localhost:5000";

// ── Category config ────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: "all",    label: "All",                  icon: "🏠" },
  { id: "blockA", label: "Block A – Boys",        icon: "🛏️" },
  { id: "blockB", label: "Block B – Girls",       icon: "🛏️" },
  { id: "blockC", label: "Block C – Instructures & Lectures",   icon: "📚" },
];

function getCategory(file) {
  const name = (file.name || file.url || "").toLowerCase();
  if (/block\s*a/i.test(name)) return "blockA";
  if (/block\s*b/i.test(name)) return "blockB";
  if (/block\s*c/i.test(name)) return "blockC";
  return "other";
}

// ── Lightbox ───────────────────────────────────────────────────────────────────
function Lightbox({ file, files, onClose, onPrev, onNext }) {
  useEffect(() => {
    const fn = (e) => {
      if (e.key === "Escape")     onClose();
      if (e.key === "ArrowLeft")  onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose, onPrev, onNext]);

  if (!file) return null;

  const url  = `${API_BASE}${file.url}`;
  const name = file.name || file.url.split("/").pop();
  const idx  = files.findIndex((f) => f.url === file.url);
  const cat  = CATEGORIES.find((c) => c.id === getCategory(file));

  return (
    <div style={S.overlay} onClick={onClose}>
      <div style={S.overlayBg} />

      <button style={S.closeBtn} onClick={onClose} title="Close (Esc)">✕</button>

      <div style={S.lbWrap} onClick={(e) => e.stopPropagation()}>
        {/* Prev */}
        <button style={{ ...S.navBtn, left: -56 }} onClick={onPrev}>‹</button>

        {/* Media */}
        <div style={S.mediaBox}>
          {file.type === "video" ? (
            <video controls autoPlay style={S.lbVideo}>
              <source src={url} />
            </video>
          ) : (
            <img
              src={url}
              alt={name}
              style={S.lbImg}
              onError={(e) => { e.target.src = `https://picsum.photos/seed/${idx}/900/600`; }}
            />
          )}

          {/* Caption bar */}
          <div style={S.caption}>
            <span style={S.catPill}>{cat?.icon} {cat?.label ?? "Other"}</span>
            <span style={S.capName}>{name}</span>
            <span style={S.counter}>{idx + 1} / {files.length}</span>
          </div>
        </div>

        {/* Next */}
        <button style={{ ...S.navBtn, right: -56 }} onClick={onNext}>›</button>
      </div>

      {/* Thumbnail strip */}
      <div style={S.strip}>
        {files.map((f, i) =>
          f.type === "video" ? (
            <div
              key={f.url}
              style={{
                ...S.thumbBox,
                border: f.url === file.url ? "2px solid #3B82F6" : "2px solid transparent",
              }}
            >
              <span style={{ color: "#fff", fontSize: 20 }}>▶</span>
            </div>
          ) : (
            <img
              key={f.url}
              src={`${API_BASE}${f.url}`}
              alt=""
              style={{
                ...S.thumb,
                border:  f.url === file.url ? "2px solid #3B82F6" : "2px solid transparent",
                opacity: f.url === file.url ? 1 : 0.5,
              }}
              onError={(e) => { e.target.src = `https://picsum.photos/seed/${i}/80/60`; }}
            />
          )
        )}
      </div>
    </div>
  );
}

// ── Main Gallery ───────────────────────────────────────────────────────────────
export default function Gallery() {
  const [files,    setFiles]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [err,      setErr]      = useState("");
  const [active,   setActive]   = useState("all");
  const [hovered,  setHovered]  = useState(null);
  const [lightbox, setLightbox] = useState(null);

  // ── Fetch from backend ─────────────────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem("studentToken");
    fetch(`${API_BASE}/api/gallery`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then((data) => { setFiles(data.files || []); setLoading(false); })
      .catch(() => {
        setErr("Gallery not loading. Check backend /api/gallery route.");
        setLoading(false);
      });
  }, []);

  // ── Filter by category ─────────────────────────────────────────────────────
  const filtered =
    active === "all" ? files : files.filter((f) => getCategory(f) === active);

  // ── Lightbox navigation ────────────────────────────────────────────────────
  const openLb  = (f) => setLightbox(f);
  const closeLb = useCallback(() => setLightbox(null), []);
  const goPrev  = useCallback(() => {
    if (!lightbox) return;
    const i = filtered.findIndex((f) => f.url === lightbox.url);
    setLightbox(filtered[(i - 1 + filtered.length) % filtered.length]);
  }, [lightbox, filtered]);
  const goNext  = useCallback(() => {
    if (!lightbox) return;
    const i = filtered.findIndex((f) => f.url === lightbox.url);
    setLightbox(filtered[(i + 1) % filtered.length]);
  }, [lightbox, filtered]);

  // ── Loading state ──────────────────────────────────────────────────────────
  if (loading)
    return (
      <div style={S.stateBox}>
        <div style={S.spinner} />
        <p style={S.stateText}>Loading gallery…</p>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );

  // ── Error state ────────────────────────────────────────────────────────────
  if (err)
    return (
      <div style={S.stateBox}>
        <div style={{ fontSize: 40 }}>⚠️</div>
        <p style={{ color: "#ef4444", marginTop: 12 }}>{err}</p>
      </div>
    );

  // ── Main render ────────────────────────────────────────────────────────────
  return (
    <div style={S.page}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {/* ── Header ── */}
      <div style={S.header}>
        <div>
          <h1 style={S.heading}>Gallery</h1>
          <p style={S.sub}>Explore hostel facilities by block</p>
        </div>
        <div style={S.totalBadge}>{filtered.length} items</div>
      </div>

      {/* ── Category Tabs ── */}
      <div style={S.tabs}>
        {CATEGORIES.map((cat) => {
          const count =
            cat.id === "all"
              ? files.length
              : files.filter((f) => getCategory(f) === cat.id).length;
          const on = active === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActive(cat.id)}
              style={{
                ...S.tab,
                background: on ? "linear-gradient(135deg,#1D4ED8,#3B82F6)" : "#fff",
                color:      on ? "#fff" : "#1e40af",
                boxShadow:  on ? "0 4px 14px rgba(59,130,246,.4)" : "0 1px 4px rgba(0,0,0,.07)",
                transform:  on ? "translateY(-2px)" : "none",
              }}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
              <span
                style={{
                  ...S.cnt,
                  background: on ? "rgba(255,255,255,.22)" : "#EFF6FF",
                  color:      on ? "#fff" : "#3B82F6",
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Section divider ── */}
      <div style={S.divider}>
        <div style={S.divLine} />
        <span style={S.divLabel}>
          {CATEGORIES.find((c) => c.id === active)?.label}
        </span>
        <div style={S.divLine} />
      </div>

      {/* ── Empty state ── */}
      {filtered.length === 0 && (
        <div style={S.stateBox}>
          <div style={{ fontSize: 48 }}>📭</div>
          <p style={S.stateText}>No photos found for this block.</p>
        </div>
      )}

      {/* ── Photo Grid ── */}
      <div style={S.grid}>
        {filtered.map((f, idx) => {
          const url  = `${API_BASE}${f.url}`;
          const name = f.name || f.url.split("/").pop();
          const cat  = CATEGORIES.find((c) => c.id === getCategory(f));
          const hov  = hovered === f.url;

          return (
            <div
              key={f._id || f.url}
              style={{
                ...S.card,
                transform: hov ? "translateY(-6px) scale(1.02)" : "none",
                boxShadow: hov
                  ? "0 20px 40px rgba(59,130,246,.2)"
                  : "0 2px 12px rgba(0,0,0,.07)",
              }}
              onClick={() => openLb(f)}
              onMouseEnter={() => setHovered(f.url)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Media area */}
              <div style={S.imgBox}>
                {f.type === "video" ? (
                  <div style={S.videoThumb}>
                    <span style={{ fontSize: 40 }}>▶</span>
                    <span style={{ color: "#fff", fontSize: 13, marginTop: 6 }}>
                      Click to play
                    </span>
                  </div>
                ) : (
                  <img
                    src={url}
                    alt={name}
                    style={{
                      ...S.img,
                      transform: hov ? "scale(1.08)" : "scale(1)",
                    }}
                    onError={(e) => {
                      e.target.src = `https://picsum.photos/seed/${idx}/400/280`;
                    }}
                  />
                )}

                {/* Hover overlay */}
                <div style={{ ...S.imgOverlay, opacity: hov ? 1 : 0 }}>
                  <span style={{ fontSize: 30 }}>🔍</span>
                  <span style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>
                    View Full Photo
                  </span>
                </div>

                {/* Block pill */}
                <div style={S.pill}>
                  {cat?.icon} {cat?.label ?? "Other"}
                </div>
              </div>

              {/* Card footer */}
              <div style={S.foot}>
                <p style={S.fname}>{name}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Lightbox ── */}
      {lightbox && (
        <Lightbox
          file={lightbox}
          files={filtered}
          onClose={closeLb}
          onPrev={goPrev}
          onNext={goNext}
        />
      )}
    </div>
  );
}

// ── Style object ───────────────────────────────────────────────────────────────
const S = {
  // Page
  page: { padding: "28px 32px", background: "linear-gradient(160deg,#f0f7ff 0%,#fff 60%)", minHeight: "100vh", fontFamily: "'Segoe UI',system-ui,sans-serif" },

  // Header
  header:     { display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 28 },
  heading:    { fontSize: 32, fontWeight: 800, color: "#1e3a8a", margin: 0, letterSpacing: "-0.5px" },
  sub:        { fontSize: 14, color: "#64748b", margin: "4px 0 0" },
  totalBadge: { background: "linear-gradient(135deg,#1D4ED8,#3B82F6)", color: "#fff", padding: "6px 16px", borderRadius: 999, fontSize: 13, fontWeight: 700 },

  // Tabs
  tabs: { display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 },
  tab:  { display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 999, border: "1.5px solid #BFDBFE", fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "all .25s ease" },
  cnt:  { padding: "2px 8px", borderRadius: 999, fontSize: 12, fontWeight: 700 },

  // Divider
  divider:  { display: "flex", alignItems: "center", gap: 12, marginBottom: 24 },
  divLine:  { flex: 1, height: 1, background: "linear-gradient(90deg,transparent,#BFDBFE,transparent)" },
  divLabel: { fontSize: 11, fontWeight: 700, color: "#3B82F6", textTransform: "uppercase", letterSpacing: "0.1em", whiteSpace: "nowrap" },

  // Grid
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 20 },
  card: { borderRadius: 16, overflow: "hidden", background: "#fff", cursor: "pointer", transition: "transform .25s ease, box-shadow .25s ease", border: "1px solid #E0EDFF" },

  imgBox:    { position: "relative", width: "100%", height: 200, overflow: "hidden" },
  img:       { width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform .4s ease" },
  videoThumb:{ width: "100%", height: "100%", background: "linear-gradient(135deg,#1D4ED8,#0f2454)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#fff" },
  imgOverlay:{ position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(29,78,216,.82),rgba(59,130,246,.7))", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, transition: "opacity .25s ease", backdropFilter: "blur(2px)" },
  pill:      { position: "absolute", top: 10, left: 10, background: "rgba(255,255,255,.92)", color: "#1e40af", fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 999, backdropFilter: "blur(4px)", boxShadow: "0 2px 8px rgba(0,0,0,.12)" },
  foot:      { padding: "12px 14px" },
  fname:     { fontSize: 13, color: "#1e3a8a", fontWeight: 600, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },

  // States
  stateBox:  { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 80 },
  stateText: { color: "#64748b", marginTop: 16, fontSize: 15 },
  spinner:   { width: 40, height: 40, border: "4px solid #BFDBFE", borderTop: "4px solid #3B82F6", borderRadius: "50%", animation: "spin 0.8s linear infinite" },

  // Lightbox
  overlay:  { position: "fixed", inset: 0, zIndex: 1000, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 },
  overlayBg:{ position: "absolute", inset: 0, background: "rgba(7,18,46,.92)", backdropFilter: "blur(10px)" },
  closeBtn: { position: "fixed", top: 20, right: 24, zIndex: 1002, background: "rgba(255,255,255,.15)", border: "1px solid rgba(255,255,255,.25)", color: "#fff", width: 38, height: 38, borderRadius: "50%", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
  lbWrap:   { position: "relative", display: "flex", alignItems: "center", zIndex: 1001, maxWidth: 900, width: "100%" },
  navBtn:   { position: "absolute", background: "rgba(255,255,255,.12)", border: "1px solid rgba(255,255,255,.2)", color: "#fff", width: 44, height: 44, borderRadius: "50%", fontSize: 28, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1002 },
  mediaBox: { width: "100%", borderRadius: 20, overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,.5)" },
  lbImg:    { width: "100%", maxHeight: "65vh", objectFit: "contain", background: "#0a1628", display: "block" },
  lbVideo:  { width: "100%", maxHeight: "65vh", background: "#000", display: "block" },
  caption:  { background: "linear-gradient(135deg,#0f2454,#1a3a8f)", padding: "14px 20px", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" },
  catPill:  { background: "rgba(59,130,246,.3)", border: "1px solid rgba(96,165,250,.4)", color: "#93C5FD", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999, textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" },
  capName:  { color: "#fff", fontSize: 15, fontWeight: 700, flex: 1 },
  counter:  { color: "rgba(255,255,255,.5)", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap", marginLeft: "auto" },

  // Thumbnail strip
  strip:    { display: "flex", gap: 8, marginTop: 14, overflowX: "auto", maxWidth: 900, width: "100%", padding: "4px 0", zIndex: 1001, position: "relative" },
  thumb:    { width: 72, height: 50, objectFit: "cover", borderRadius: 8, cursor: "pointer", flexShrink: 0, transition: "all .2s ease" },
  thumbBox: { width: 72, height: 50, borderRadius: 8, background: "linear-gradient(135deg,#1D4ED8,#0f2454)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
};
