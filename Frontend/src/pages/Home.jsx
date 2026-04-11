import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("revealed")),
      { threshold: 0.12, rootMargin: "0px 0px -30px 0px" }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="homePage">

      {/* ── NAV ── */}
      <nav className="nav">
        <div className="navLogo">
          <div className="navLogoIcon">U</div>
          <span className="navLogoText">SLIIT <strong>UniStay</strong></span>
        </div>
        <div className="navLinks">
          <a href="#features" className="navLink">Features</a>
          <a href="#blocks"   className="navLink">Blocks</a>
          <a href="#contact"  className="navLink">Contact</a>
          <a href="/ometh-home" className="navLink">Room Info</a>
          <a href="/payment/student/dashboard" className="navLink">Payments</a>
          <a href="/complaint/dashboard" className="navLink">Complaints</a>
        </div>


         {/* UPDATED: Login button → dropdown Admin/User */}
        <div className="navActions">
          <div className="loginWrap">
            <button className="navLoginBtn">Login ▾</button>

            <div className="loginDropdown">
              <button onClick={() => navigate("/admin-login")}>Admin</button>
<button onClick={() => navigate("/login")}>User</button>
            </div>
          </div>

          <button
            className="navRegisterBtn"
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </div>
      </nav>



   

      {/* ── HERO ── */}
      <section className="hero">
        <div className="heroBg" />
        <div className="heroDeco heroDeco1" />
        <div className="heroDeco heroDeco2" />
        <div className="heroDeco heroDeco3" />

        <div className="heroContent">
          <div className="heroBadge">
            <span className="badgePulse" />
            Official SLIIT Malabe Hostel System
          </div>

          <h1 className="heroTitle">
            Your Campus Home,<br />
            <span className="heroAccent">Smarter Than Ever</span>
          </h1>

          <p className="heroSubtitle">
            SLIIT UniStay is the official digital hostel management platform for SLIIT Malabe —
            book rooms, request leave, and stay connected, all in one place.
          </p>

          <div className="heroCTA">
            <button className="ctaPrimary" onClick={() => navigate("/register")}>
              Get Started
              <span className="ctaArrow">→</span>
            </button>
            <button className="ctaSecondary" onClick={() => navigate("/login")}>
              Login to Dashboard
            </button>
          </div>

          <div className="heroTrust">
            <span className="trustDot" />
            <span className="trustText">Trusted by SLIIT students & faculty</span>
            <span className="trustSep">·</span>
            <span className="trustText">Secure & Private</span>
            <span className="trustSep">·</span>
            <span className="trustText">24/7 Available</span>
          </div>
        </div>

        {/* Hero card mockup */}
        <div className="heroCard">
          <div className="heroCardInner">
            <div className="hcTop">
              <div className="hcDot red"/><div className="hcDot yellow"/><div className="hcDot green"/>
              <span className="hcLabel">UniStay Dashboard</span>
            </div>
            <div className="hcBody">
              {[
                { icon:"🛏️", label:"Room Selection",  val:"Block A – 204",  badge:"Booked",   bc:"#DCFCE7", tc:"#16A34A" },
                { icon:"📋", label:"Leave Request",    val:"2 Pending",      badge:"Review",   bc:"#FEF9C3", tc:"#CA8A04" },
                { icon:"🔔", label:"Notifications",   val:"3 New alerts",   badge:"New",      bc:"#DBEAFE", tc:"#1D4ED8" },
                { icon:"🖼️", label:"Gallery",         val:"Block Photos",   badge:"Updated",  bc:"#F3E8FF", tc:"#7C3AED" },
              ].map((r) => (
                <div className="hcRow" key={r.label}>
                  <span className="hcIcon">{r.icon}</span>
                  <div className="hcMeta">
                    <div className="hcName">{r.label}</div>
                    <div className="hcVal">{r.val}</div>
                  </div>
                  <span className="hcBadge" style={{ background: r.bc, color: r.tc }}>{r.badge}</span>
                </div>
              ))}
            </div>
            <div className="hcFooter">
              <div className="hcAvatar">S</div>
              <div>
                <div className="hcStudent">Student Dashboard</div>
                <div className="hcUni">SLIIT Malabe</div>
              </div>
              <div className="hcStatus">● Live</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section className="statsStrip reveal">
        {[
          { num:"3",     label:"Hostel Blocks"       },
          { num:"24/7",  label:"Security & Support"  },
          { num:"100%",  label:"Digital Management"  },
          { num:"Wi-Fi", label:"Campus Connected"    },
        ].map((s, i) => (
          <div className="stripStat" key={s.label} style={{ transitionDelay:`${i*0.1}s` }}>
            <div className="stripNum">{s.num}</div>
            <div className="stripLabel">{s.label}</div>
          </div>
        ))}
      </section>

      {/* ── FEATURES ── */}
      <section className="featSection" id="features">
        <div className="sectionHead reveal">
          <div className="sTag">Platform Features</div>
          <h2 className="sTitle">Everything You Need</h2>
          <p className="sDesc">One platform to manage your entire hostel experience at SLIIT Malabe.</p>
        </div>
        <div className="featGrid">
          {[
            { icon:"🛏️", title:"Room Selection",   desc:"Browse and book your preferred room across all three blocks with a simple, guided selection process.",   delay:"0s"    },
            { icon:"📋", title:"Leave Requests",   desc:"Submit, track, and manage leave requests digitally — fully paperless and processed in real time.",        delay:"0.08s" },
            { icon:"🔔", title:"Notifications",    desc:"Receive real-time hostel announcements, maintenance alerts, and important updates instantly.",           delay:"0.16s" },
            { icon:"🖼️", title:"Photo Gallery",   desc:"Explore high-quality photos of all blocks and rooms before moving in. Browse by block or category.",     delay:"0.24s" },
            { icon:"👤", title:"Student Profile",  desc:"Manage your personal details, academic info, and hostel preferences from a single, unified dashboard.",  delay:"0.32s" },
            { icon:"🔒", title:"Secure Access",    desc:"JWT-based authentication ensures your data stays private and only accessible to you.",                   delay:"0.40s" },
          ].map((f) => (
            <div className="featCard reveal" key={f.title} style={{ transitionDelay: f.delay }}>
              <div className="featIcon">{f.icon}</div>
              <h3 className="featTitle">{f.title}</h3>
              <p className="featDesc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── BLOCKS ── */}
      <section className="blocksSection" id="blocks">
        <div className="sectionHead reveal">
          <div className="sTag">Accommodation</div>
          <h2 className="sTitle">Our Hostel Blocks</h2>
          <p className="sDesc">Three purpose-built blocks to ensure every resident lives comfortably and safely.</p>
        </div>
        <div className="blocksGrid">
          {[
            { letter:"A", title:"Block A",  sub:"Boys Residence",      desc:"Secure, comfortable accommodation for male students with study areas, common rooms, and 24/7 supervision.",            color:"#1D4ED8", bg:"rgba(29,78,216,0.07)",  bdr:"rgba(29,78,216,0.18)",  delay:"0s"    },
            { letter:"B", title:"Block B",  sub:"Girls Residence",     desc:"Safe and well-managed residence for female students with dedicated wardens, enhanced security, and private spaces.",   color:"#7C3AED", bg:"rgba(124,58,237,0.07)", bdr:"rgba(124,58,237,0.18)", delay:"0.12s" },
            { letter:"C", title:"Block C",  sub:"Faculty & Lecturers", desc:"Private, peaceful accommodation for instructors and lecturers, separate from student blocks with premium facilities.", color:"#0891B2", bg:"rgba(8,145,178,0.07)",  bdr:"rgba(8,145,178,0.18)",  delay:"0.24s" },
          ].map((b) => (
            <div
              className="blockCard reveal"
              key={b.letter}
              style={{ "--bc":b.color, "--bg":b.bg, "--bdr":b.bdr, transitionDelay:b.delay }}
            >
              <div className="blkLetter" style={{ background:b.bg, color:b.color, border:`1.5px solid ${b.bdr}` }}>{b.letter}</div>
              <div className="blkSub" style={{ color:b.color }}>{b.sub}</div>
              <h3 className="blkTitle">{b.title}</h3>
              <p className="blkDesc">{b.desc}</p>
              <div className="blkBar" style={{ background:b.color }} />
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="ctaBanner reveal">
        <div className="ctaBannerDeco ctaBannerDeco1" />
        <div className="ctaBannerDeco ctaBannerDeco2" />
        <div className="ctaBannerInner">
          <h2 className="ctaBannerTitle">Ready to Move In?</h2>
          <p className="ctaBannerDesc">Create your account and start managing your hostel experience today.</p>
          <div className="ctaBannerBtns">
            <button className="ctaPrimary large" onClick={() => navigate("/register")}>
              Register Now <span className="ctaArrow">→</span>
            </button>
            <button className="ctaGhost" onClick={() => navigate("/login")}>Already have an account?</button>
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section className="contactSection reveal" id="contact">
        <div className="sectionHead">
          <div className="sTag">Contact</div>
          <h2 className="sTitle">Find Us</h2>
          <p className="sDesc">For hostel-related queries, visit the office or reach out digitally.</p>
        </div>
        <div className="contactGrid">
          {[
            { icon:"📍", label:"Address", val:"SLIIT Malabe, New Kandy Road, Malabe, Sri Lanka" },
            { icon:"📧", label:"Email",   val:"unistay@sliit.lk" },
            { icon:"📞", label:"Phone",   val:"+94 11 754 4801" },
            { icon:"🕐", label:"Hours",   val:"24/7 Security  •  Office: 8:30 AM – 4:30 PM" },
          ].map((c, i) => (
            <div className="contactCard reveal" key={c.label} style={{ transitionDelay:`${i*0.1}s` }}>
              <div className="cIcon">{c.icon}</div>
              <div>
                <div className="cLabel">{c.label}</div>
                <div className="cVal">{c.val}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footerLogo">
          <div className="navLogoIcon small">U</div>
          <span>SLIIT <strong>UniStay</strong></span>
        </div>
        <p className="footerText">© {new Date().getFullYear()} SLIIT UniStay. Official Hostel Management System — SLIIT Malabe Campus.</p>
        <div className="footerLinks">
          <button className="footerLink" onClick={() => navigate("/login")}>Login</button>
          <button className="footerLink" onClick={() => navigate("/register")}>Register</button>
        </div>
      </footer>

      {/* ── STYLES ── */}
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .homePage {
          font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
          color: #0B1B3A;
          background: #ffffff;
          overflow-x: hidden;
        }

        /* ── Scroll reveal ── */
        .reveal {
          opacity: 0;
          transform: translateY(40px);
          transition:
            opacity 0.7s cubic-bezier(0.22,1,0.36,1),
            transform 0.7s cubic-bezier(0.22,1,0.36,1);
        }
        .reveal.revealed { opacity:1; transform:translateY(0); }

        /* ── NAV ── */
        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 48px;
          height: 68px;
          background: rgba(255,255,255,0.88);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(29,78,216,0.1);
          box-shadow: 0 2px 20px rgba(29,78,216,0.07);
        }
        .navLogo { display:flex; align-items:center; gap:10px; text-decoration:none; }
        .navLogoIcon {
          width:38px; height:38px; border-radius:11px;
          background: linear-gradient(135deg,#1D4ED8,#3B82F6);
          color:#fff; display:grid; place-items:center;
          font-size:18px; font-weight:900;
        }
        .navLogoIcon.small { width:30px;height:30px;border-radius:9px;font-size:14px; }
        .navLogoText { font-size:17px; color:#0B1B3A; }
        .navLinks { display:flex; gap:28px; }
        .navLink {
          font-size:14px; font-weight:600; color:rgba(11,27,58,0.65);
          text-decoration:none;
          transition:color 0.2s;
        }
        .navLink:hover { color:#1D4ED8; }
        .navActions { display:flex; gap:10px; }
        .navLoginBtn {
          padding:8px 20px; border-radius:999px;
          border:1.5px solid rgba(29,78,216,0.3);
          background:transparent; color:#1D4ED8;
          font-size:13px; font-weight:700; cursor:pointer;
          transition:all 0.2s;
        }
        .navLoginBtn:hover { background:rgba(29,78,216,0.07); }
        .navRegisterBtn {
          padding:8px 20px; border-radius:999px;
          border:none;
          background:linear-gradient(135deg,#1D4ED8,#3B82F6);
          color:#fff;
          font-size:13px; font-weight:700; cursor:pointer;
          box-shadow:0 4px 14px rgba(29,78,216,0.35);
          transition:all 0.2s;
        }
        .navRegisterBtn:hover { transform:translateY(-1px); box-shadow:0 6px 18px rgba(29,78,216,0.45); }

        

        /* ── LOGIN DROPDOWN ── */
        .loginWrap {
          position: relative;
          display: inline-block;
        }

        .loginDropdown {
          display: none;
          position: absolute;
          top: 100%;
          right: 0;
          padding-top: 10px;
          min-width: 140px;
          z-index: 200;
        }

        .loginWrap:hover .loginDropdown,
        .loginDropdown:hover {
          display: block;
        }

        .loginDropdownInner {
          background: #fff;
          border: 1.5px solid rgba(29,78,216,0.18);
          border-radius: 14px;
          box-shadow: 0 12px 36px rgba(29,78,216,0.18), 0 2px 8px rgba(29,78,216,0.08);
          overflow: hidden;
          animation: dropdownFade 0.2s cubic-bezier(0.22,1,0.36,1) both;
        }

        @keyframes dropdownFade {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .loginDropdown button {
          display: block;
          width: 100%;
          padding: 12px 20px;
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(29,78,216,0.08);
          color: #1D4ED8;
          font-size: 13px;
          font-weight: 700;
          text-align: left;
          cursor: pointer;
          transition: background 0.18s, color 0.18s;
          letter-spacing: 0.01em;
        }

        .loginDropdown button:last-child {
          border-bottom: none;
        }

        .loginDropdown button:hover {
          background: linear-gradient(135deg, rgba(29,78,216,0.09), rgba(59,130,246,0.07));
          color: #1a3a8f;
        }





        /* ── HERO ── */
        .hero {
          min-height: 100vh;
          padding-top: 68px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          gap: 48px;
          padding-left: 80px; padding-right: 80px;
          position: relative;
          background: linear-gradient(160deg, #EFF6FF 0%, #F8FAFF 60%, #fff 100%);
          overflow: hidden;
        }
        .heroBg {
          position:absolute; inset:0; z-index:0;
          background:
            radial-gradient(ellipse 70% 60% at 80% 50%, rgba(59,130,246,0.12) 0%, transparent 70%),
            radial-gradient(ellipse 40% 40% at 10% 80%, rgba(29,78,216,0.07) 0%, transparent 60%);
        }
        .heroDeco {
          position:absolute; border-radius:50%; pointer-events:none;
          background:rgba(29,78,216,0.05);
        }
        .heroDeco1 { width:500px;height:500px; top:-150px;right:-100px; }
        .heroDeco2 { width:220px;height:220px; bottom:-60px;left:5%; background:rgba(59,130,246,0.06); }
        .heroDeco3 { width:100px;height:100px; top:20%;left:45%; background:rgba(29,78,216,0.04); }

        .heroContent { position:relative; z-index:1; }

        .heroBadge {
          display:inline-flex; align-items:center; gap:8px;
          background:rgba(29,78,216,0.09);
          border:1px solid rgba(29,78,216,0.2);
          padding:7px 14px; border-radius:999px;
          font-size:12px; font-weight:700; color:#1D4ED8;
          letter-spacing:0.03em;
          margin-bottom:22px;
          animation: fadeSlideUp 0.6s ease both;
        }
        .badgePulse {
          width:8px;height:8px;border-radius:50%;
          background:#22C55E;
          box-shadow:0 0 0 0 rgba(34,197,94,0.4);
          animation:ripple 2s ease infinite;
        }
        @keyframes ripple {
          0%   { box-shadow:0 0 0 0 rgba(34,197,94,0.45); }
          70%  { box-shadow:0 0 0 8px rgba(34,197,94,0); }
          100% { box-shadow:0 0 0 0 rgba(34,197,94,0); }
        }
        .heroTitle {
          font-size:52px; font-weight:900; letter-spacing:-1.5px;
          line-height:1.1; margin-bottom:18px; color:#0B1B3A;
          animation: fadeSlideUp 0.65s 0.1s ease both;
        }
        .heroAccent {
          background:linear-gradient(135deg,#1D4ED8,#60A5FA);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
          background-clip:text;
        }
        .heroSubtitle {
          font-size:16px; color:rgba(11,27,58,0.65); line-height:1.7;
          max-width:480px; margin-bottom:32px;
          animation: fadeSlideUp 0.65s 0.2s ease both;
        }
        .heroCTA {
          display:flex; gap:14px; align-items:center; margin-bottom:24px;
          animation: fadeSlideUp 0.65s 0.3s ease both;
        }
        .ctaPrimary {
          display:flex; align-items:center; gap:8px;
          padding:14px 28px; border-radius:999px; border:none;
          background:linear-gradient(135deg,#1D4ED8,#3B82F6);
          color:#fff; font-size:15px; font-weight:700; cursor:pointer;
          box-shadow:0 8px 28px rgba(29,78,216,0.38);
          transition:all 0.22s ease;
        }
        .ctaPrimary:hover { transform:translateY(-2px); box-shadow:0 12px 36px rgba(29,78,216,0.48); }
        .ctaPrimary.large { padding:16px 36px; font-size:16px; }
        .ctaArrow { font-size:18px; transition:transform 0.2s; }
        .ctaPrimary:hover .ctaArrow { transform:translateX(4px); }
        .ctaSecondary {
          padding:14px 28px; border-radius:999px;
          border:1.5px solid rgba(29,78,216,0.25);
          background:rgba(255,255,255,0.8);
          color:#1D4ED8; font-size:15px; font-weight:700; cursor:pointer;
          backdrop-filter:blur(4px);
          transition:all 0.22s;
        }
        .ctaSecondary:hover { background:#fff; border-color:rgba(29,78,216,0.5); }
        .ctaGhost {
          padding:14px 24px; border-radius:999px;
          border:1.5px solid rgba(255,255,255,0.35);
          background:rgba(255,255,255,0.12);
          color:rgba(255,255,255,0.9); font-size:14px; font-weight:600; cursor:pointer;
          transition:all 0.2s;
        }
        .ctaGhost:hover { background:rgba(255,255,255,0.22); }
        .heroTrust {
          display:flex; align-items:center; gap:10px;
          font-size:12px; color:rgba(11,27,58,0.5); font-weight:600;
          animation: fadeSlideUp 0.65s 0.4s ease both;
        }
        .trustDot { width:6px;height:6px;border-radius:50%;background:#22C55E; }
        .trustSep { opacity:0.35; }

        @keyframes fadeSlideUp {
          from { opacity:0; transform:translateY(24px); }
          to   { opacity:1; transform:translateY(0); }
        }

        /* Dashboard card mockup */
        .heroCard {
          position:relative; z-index:1;
          animation: fadeSlideUp 0.8s 0.2s ease both;
        }
        .heroCardInner {
          background:#fff;
          border-radius:24px;
          box-shadow:0 32px 80px rgba(29,78,216,0.2), 0 0 0 1px rgba(29,78,216,0.08);
          overflow:hidden;
        }
        .hcTop {
          background:linear-gradient(135deg,#1D4ED8,#1a3a8f);
          padding:16px 20px;
          display:flex; align-items:center; gap:8px;
        }
        .hcDot { width:12px;height:12px;border-radius:50%; }
        .hcDot.red    { background:#FF5F57; }
        .hcDot.yellow { background:#FFBD2E; }
        .hcDot.green  { background:#28C840; }
        .hcLabel { margin-left:auto; font-size:13px; color:rgba(255,255,255,0.75); font-weight:600; }
        .hcBody { padding:16px; display:grid; gap:10px; }
        .hcRow {
          display:flex; align-items:center; gap:12px;
          padding:12px 14px; border-radius:14px;
          background:#F8FAFF; border:1px solid rgba(29,78,216,0.08);
          transition:background 0.2s;
        }
        .hcRow:hover { background:#EFF6FF; }
        .hcIcon { font-size:20px; flex:0 0 auto; }
        .hcMeta { flex:1; }
        .hcName { font-size:12px; color:rgba(11,27,58,0.55); font-weight:600; }
        .hcVal  { font-size:14px; font-weight:800; color:#0B1B3A; }
        .hcBadge{ padding:4px 10px; border-radius:999px; font-size:11px; font-weight:800; }
        .hcFooter {
          padding:14px 20px;
          border-top:1px solid rgba(29,78,216,0.08);
          display:flex; align-items:center; gap:12px;
        }
        .hcAvatar {
          width:36px;height:36px;border-radius:10px;
          background:linear-gradient(135deg,#1D4ED8,#3B82F6);
          color:#fff;display:grid;place-items:center;font-weight:900;
        }
        .hcStudent { font-size:13px;font-weight:800;color:#0B1B3A; }
        .hcUni    { font-size:11px;color:rgba(11,27,58,0.5); }
        .hcStatus { margin-left:auto;font-size:12px;font-weight:700;color:#22C55E; }

        /* ── STATS STRIP ── */
        .statsStrip {
          display:grid; grid-template-columns:repeat(4,1fr);
          background:linear-gradient(135deg,#1D4ED8,#1e40af);
          padding:36px 80px;
          gap:0;
        }
        .stripStat {
          text-align:center; padding:0 20px;
          border-right:1px solid rgba(255,255,255,0.15);
          transition-delay:inherit;
        }
        .stripStat:last-child { border-right:none; }
        .stripNum   { font-size:34px;font-weight:900;color:#fff;letter-spacing:-1px; }
        .stripLabel { font-size:13px;color:rgba(255,255,255,0.7);margin-top:6px;font-weight:600; }

        /* ── SECTIONS ── */
        .sectionHead { text-align:center; margin-bottom:40px; }
        .sTag {
          display:inline-block;
          background:rgba(29,78,216,0.09); color:#1D4ED8;
          font-size:11px;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;
          padding:6px 14px;border-radius:999px;margin-bottom:12px;
        }
        .sTitle { font-size:34px;font-weight:900;letter-spacing:-0.8px;color:#0B1B3A;margin-bottom:10px; }
        .sDesc  { font-size:15px;color:rgba(11,27,58,0.6);line-height:1.6;max-width:520px;margin:0 auto; }

        /* ── FEATURES ── */
        .featSection {
          padding:90px 80px;
          background:linear-gradient(170deg,#F0F7FF,#fff);
        }
        .featGrid {
          display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:20px;
        }
        .featCard {
          background:#fff;
          border:1px solid rgba(29,78,216,0.1);
          border-radius:20px; padding:28px 24px;
          transition:transform 0.25s ease, box-shadow 0.25s ease;
        }
        .featCard:hover { transform:translateY(-5px); box-shadow:0 16px 40px rgba(29,78,216,0.12); }
        .featIcon  { font-size:30px; margin-bottom:16px; }
        .featTitle { font-size:17px;font-weight:800;margin-bottom:10px;color:#0B1B3A; }
        .featDesc  { font-size:13px;color:rgba(11,27,58,0.6);line-height:1.6; }

        /* ── BLOCKS ── */
        .blocksSection { padding:90px 80px; background:#fff; }
        .blocksGrid {
          display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:20px;
        }
        .blockCard {
          border:1.5px solid var(--bdr); border-radius:22px;
          padding:30px 26px 24px; background:var(--bg);
          position:relative; overflow:hidden;
          transition:transform 0.25s ease, box-shadow 0.25s ease;
        }
        .blockCard:hover { transform:translateY(-6px); box-shadow:0 20px 48px rgba(29,78,216,0.14); }
        .blkLetter {
          width:56px;height:56px;border-radius:18px;
          display:grid;place-items:center;
          font-size:24px;font-weight:900;margin-bottom:14px;
        }
        .blkSub   { font-size:12px;font-weight:800;letter-spacing:0.06em;text-transform:uppercase;margin-bottom:8px; }
        .blkTitle { font-size:20px;font-weight:900;margin-bottom:10px;color:#0B1B3A; }
        .blkDesc  { font-size:13px;color:rgba(11,27,58,0.62);line-height:1.6; }
        .blkBar   { position:absolute;bottom:0;left:0;right:0;height:3px;opacity:0.55;border-radius:0 0 22px 22px; }

        /* ── CTA BANNER ── */
        .ctaBanner {
          margin:0 80px 0;
          background:linear-gradient(135deg,#1D4ED8,#1a3a8f);
          border-radius:28px; padding:64px 80px;
          text-align:center; color:#fff;
          position:relative; overflow:hidden;
          box-shadow:0 28px 72px rgba(29,78,216,0.38);
        }
        .ctaBannerDeco {
          position:absolute; border-radius:50%;
          background:rgba(255,255,255,0.06); pointer-events:none;
        }
        .ctaBannerDeco1 { width:420px;height:420px; top:-180px;right:-80px; }
        .ctaBannerDeco2 { width:220px;height:220px; bottom:-80px;left:5%; }
        .ctaBannerInner { position:relative;z-index:1; }
        .ctaBannerTitle { font-size:40px;font-weight:900;letter-spacing:-1px;margin-bottom:14px; }
        .ctaBannerDesc  { font-size:16px;color:rgba(255,255,255,0.78);margin-bottom:32px;line-height:1.6; }
        .ctaBannerBtns  { display:flex;gap:16px;justify-content:center;align-items:center; }

        /* ── CONTACT ── */
        .contactSection { padding:90px 80px; background:linear-gradient(170deg,#F8FAFF,#fff); }
        .contactGrid {
          display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:16px;
        }
        .contactCard {
          display:flex;align-items:flex-start;gap:16px;
          padding:20px;border-radius:18px;
          background:#fff;border:1px solid rgba(29,78,216,0.1);
          transition:border-color 0.2s,box-shadow 0.2s,transform 0.2s;
        }
        .contactCard:hover {
          border-color:rgba(29,78,216,0.25);
          box-shadow:0 8px 28px rgba(29,78,216,0.09);
          transform:translateY(-2px);
        }
        .cIcon {
          font-size:22px;width:48px;height:48px;flex:0 0 auto;
          border-radius:14px;background:rgba(29,78,216,0.09);
          display:grid;place-items:center;
        }
        .cLabel { font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;color:rgba(11,27,58,0.45);margin-bottom:5px; }
        .cVal   { font-size:14px;font-weight:700;color:#0B1B3A;line-height:1.45; }

        /* ── FOOTER ── */
        .footer {
          padding:32px 80px;
          background:#0B1B3A;
          display:flex;align-items:center;gap:20px;flex-wrap:wrap;
        }
        .footerLogo {
          display:flex;align-items:center;gap:10px;
          font-size:15px;color:#fff;
        }
        .footerText { flex:1;font-size:12px;color:rgba(255,255,255,0.4);text-align:center; }
        .footerLinks { display:flex;gap:12px; }
        .footerLink {
          font-size:13px;font-weight:600;color:rgba(255,255,255,0.55);
          background:none;border:none;cursor:pointer;
          transition:color 0.2s;
        }
        .footerLink:hover { color:#fff; }

        /* ── RESPONSIVE ── */
        @media(max-width:1024px){
          .hero         { grid-template-columns:1fr; text-align:center; padding:100px 40px 60px; }
          .heroContent  { order:2; }
          .heroCard     { order:1; max-width:480px; margin:0 auto; }
          .heroSubtitle { max-width:100%; }
          .heroCTA      { justify-content:center; }
          .heroTrust    { justify-content:center; }
          .statsStrip   { padding:36px 40px; }
          .featSection, .blocksSection, .contactSection { padding:70px 40px; }
          .ctaBanner    { margin:0 40px; padding:48px 40px; }
          .featGrid, .blocksGrid { grid-template-columns:repeat(2,1fr); }
          .footer       { padding:28px 40px; }
          .nav          { padding:0 28px; }
        }
        @media(max-width:640px){
          .heroTitle    { font-size:34px; }
          .heroStats    { grid-template-columns:repeat(2,1fr); }
          .statsStrip   { grid-template-columns:repeat(2,1fr); padding:28px 20px; gap:20px; }
          .stripStat    { border-right:none; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:20px; }
          .stripStat:nth-child(odd)  { border-right:1px solid rgba(255,255,255,0.1); }
          .stripStat:last-child      { border-bottom:none; }
          .featGrid, .blocksGrid, .contactGrid { grid-template-columns:1fr; }
          .featSection, .blocksSection, .contactSection { padding:56px 20px; }
          .ctaBanner    { margin:0 16px; padding:36px 24px; }
          .ctaBannerTitle { font-size:28px; }
          .ctaBannerBtns  { flex-direction:column; }
          .footer       { padding:24px 20px; flex-direction:column; text-align:center; }
          .nav          { padding:0 16px; }
          .navLinks     { display:none; }
        }
      `}</style>
    </div>
  );
}
