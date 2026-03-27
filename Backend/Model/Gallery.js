import { useState, useEffect, useCallback } from "react";

const API_BASE = "http://localhost:5000/api/gallery"; // returns { files: [...] }
const SERVER_BASE = "http://localhost:5000"; // to make full URL

const BLOCKS = [
  { key: "ALL", label: "All Photos", sub: "", color: "#1565c0", accent: "#e3f0ff" },
  { key: "A", label: "Block A", sub: "Boys", color: "#1976d2", accent: "#e8f4fd" },
  { key: "B", label: "Block B", sub: "Girls", color: "#1565c0", accent: "#dceeff" },
  { key: "C", label: "Block C", sub: "Lecturers", color: "#0d47a1", accent: "#d6e8ff" },
];

// ✅ detect block from filename like "Block A 1.png"
function detectBlock(name) {
  const lower = name.toLowerCase();
  if (lower.includes("block a")) return "A";
  if (lower.includes("block b")) return "B";
  if (lower.includes("block c")) return "C";
  return "ALL";
}

export default function Gallery() {
  const [media, setMedia] = useState([]); // both images + videos
  const [activeBlock, setActiveBlock] = useState("ALL");
  const [lightbox, setLightbox] = useState({ open: false, index: 0 });
  const [loading, setLoading] = useState(false);

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(API_BASE);
      const data = await res.json();

      const list = (data.files || []).map((item) => {
        const block = detectBlock(item.name);
        return {
          ...item,
          block,
          title: item.name,
          fullUrl: item.url.startsWith("http") ? item.url : `${SERVER_BASE}${item.url}`,
        };
      });

      setMedia(list);
    } catch (e) {
      setMedia([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  // filter by block
  const visible = activeBlock === "ALL" ? media : media.filter((m) => m.block === activeBlock);

  useEffect(() => {
    const handle = (e) => {
      if (!lightbox.open) return;
      if (e.key === "ArrowRight") setLightbox((l) => ({ ...l, index: (l.index + 1) % visible.length }));
      if (e.key === "ArrowLeft") setLightbox((l) => ({ ...l, index: (l.index - 1 + visible.length) % visible.length }));
      if (e.key === "Escape") setLightbox({ open: false, index: 0 });
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [lightbox.open, visible.length]);

  const getBlockInfo = (key) => BLOCKS.find((b) => b.key === key) || BLOCKS[0];
  const current = visible[lightbox.index];
  const activeInfo = getBlockInfo(activeBlock);

  return (
    <>
      {/* ✅ keep your same CSS exactly as you already have */}
      {/* I removed the huge CSS here to keep message clean.
          ✅ IMPORTANT: keep your existing <style> ... </style> block unchanged. */}

      <div className="g-root">
        {/* HERO */}
        <div className="g-hero">
          <div className="g-eyebrow">
            <div className="g-pulse"></div>
            3Y2S Hostel Management
          </div>
          <h1 className="g-title">Hostel <em>Photo</em> Gallery</h1>
          <p className="g-sub">Explore our campus blocks — Boys, Girls &amp; Lecturer accommodation</p>

          <div className="g-stats">
            {BLOCKS.slice(1).map((b) => {
              const cnt = media.filter((m) => m.type === "image" && m.block === b.key).length;
              return (
                <div key={b.key} className="g-stat">
                  <div>
                    <div className="g-stat-num">{cnt}</div>
                    <div className="g-stat-lbl">{b.label}<br />{b.sub}</div>
                  </div>
                </div>
              );
            })}
            <div className="g-stat">
              <div>
                <div className="g-stat-num">{media.filter((m) => m.type === "image").length}</div>
                <div className="g-stat-lbl">Total<br />Photos</div>
              </div>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="g-tabs">
          {BLOCKS.map((block) => {
            const count = block.key === "ALL"
              ? visible.length
              : media.filter((m) => m.block === block.key && m.type === "image").length;

            const active = activeBlock === block.key;
            return (
              <button
                key={block.key}
                className={`g-tab${active ? " active" : ""}`}
                onClick={() => {
                  setActiveBlock(block.key);
                  setLightbox({ open: false, index: 0 });
                }}
              >
                <div className="g-tab-txt">
                  <span>{block.label}</span>
                  {block.sub && <span className="g-tab-sub">{block.sub}</span>}
                </div>
                <span className="g-tab-cnt">{count}</span>
              </button>
            );
          })}
        </div>

        {/* SECTION BAR */}
        <div className="g-section">
          <span className="g-section-title">
            {activeInfo.label}{activeInfo.sub ? ` — ${activeInfo.sub}` : ""}
          </span>
          <div className="g-section-line"></div>
          <span className="g-section-count">
            {visible.filter((m) => m.type === "image").length} photo{visible.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* CONTENT */}
        {loading ? (
          <div style={{ padding: 40 }}>Loading...</div>
        ) : visible.length === 0 ? (
          <div className="g-empty">
            <div style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>No Media Yet</div>
            <p style={{ fontSize: 14, color: "#94a3b8", maxWidth: 300, lineHeight: 1.7 }}>
              Files will appear here once added to Backend/uploads/Gallery
            </p>
          </div>
        ) : (
          <div className="g-grid">
            {visible.map((item, idx) => {
              const blockInfo = getBlockInfo(item.block);
              return (
                <div
                  key={item.name}
                  className="g-card"
                  style={{ animationDelay: `${idx * 0.055}s` }}
                  onClick={() => setLightbox({ open: true, index: idx })}
                >
                  <div className="g-img-wrap">
                    {item.type === "video" ? (
                      <video src={item.fullUrl} controls style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <img
                        src={item.fullUrl}
                        alt={item.title}
                        onError={(e) => { e.target.src = "https://via.placeholder.com/400x300?text=No+Image"; }}
                      />
                    )}
                    <div className="g-overlay">
                      <div className="g-overlay-tag">
                        {blockInfo.label}{blockInfo.sub ? ` · ${blockInfo.sub}` : ""}
                      </div>
                    </div>
                  </div>

                  <div className="g-card-body">
                    <span className="g-card-title">{item.title}</span>
                    <span className="g-block-badge" style={{ background: blockInfo.accent, color: blockInfo.color }}>
                      {item.block}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* LIGHTBOX */}
      {lightbox.open && current && (
        <div className="g-lb-bg" onClick={() => setLightbox({ open: false, index: 0 })}>
          <div className="g-lb-box" onClick={(e) => e.stopPropagation()}>
            <div className="g-lb-img-area">
              <button className="g-lb-close" onClick={() => setLightbox({ open: false, index: 0 })}>
                ✕
              </button>

              <button
                className="g-lb-nav"
                style={{ left: 14 }}
                onClick={() => setLightbox((l) => ({ ...l, index: (l.index - 1 + visible.length) % visible.length }))}
              >
                ‹
              </button>

              {current.type === "video" ? (
                <video src={current.fullUrl} controls style={{ width: "100%", height: "100%", objectFit: "contain" }} />
              ) : (
                <img src={current.fullUrl} alt={current.title} />
              )}

              <button
                className="g-lb-nav"
                style={{ right: 14 }}
                onClick={() => setLightbox((l) => ({ ...l, index: (l.index + 1) % visible.length }))}
              >
                ›
              </button>
            </div>

            <div className="g-lb-footer">
              <div>
                <div className="g-lb-title">{current.title}</div>
                <div className="g-lb-meta">
                  <span>{getBlockInfo(current.block).label}</span>
                </div>
              </div>
              <span className="g-counter">{lightbox.index + 1} / {visible.length}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
