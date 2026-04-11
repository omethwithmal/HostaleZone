import React, { useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import axios from "axios";

export default function AttendanceScanner({ token }) {
  const [scanResult, setScanResult] = useState(null);
  const [scanError, setScanError] = useState("");
  const [attendances, setAttendances] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_BASE = "http://localhost:5000";

  useEffect(() => {
    fetchTodayAttendance();
  }, []);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", {
      qrbox: { width: 250, height: 250 },
      fps: 5,
    });

    scanner.render(onScanSuccess, onScanError);
    function onScanSuccess(decodedText) {
      scanner.clear();
      setScanResult(decodedText);
      markAttendance(decodedText);
    }
    function onScanError(err) {
      // ignore
    }
    return () => {
      scanner.clear().catch((error) => console.error("Failed to clear scanner", error));
    };
  }, []);

  const fetchTodayAttendance = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/api/attendance/today`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setAttendances(res.data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = async (qrPayload) => {
    try {
      setScanError("");
      const res = await axios.post(
        `${API_BASE}/api/attendance/scan`,
        { qrPayload },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.status === 201) {
        fetchTodayAttendance();
        setTimeout(() => {
          setScanResult(null); // reset scanner view after 3s to allow next scan
          const newScanner = new Html5QrcodeScanner("reader", { qrbox: { width: 250, height: 250 }, fps: 5 });
          newScanner.render(
            (text) => { newScanner.clear(); setScanResult(text); markAttendance(text); },
            () => {}
          );
        }, 3000);
      }
    } catch (error) {
      setScanError(error.response?.data?.message || "Failed to mark attendance");
      setTimeout(() => setScanResult(null), 3000);
    }
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
      {/* Scanner Section */}
      <div style={{ background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 18, padding: 20 }}>
        <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 18, color: "#f8fafc", marginBottom: 15 }}>Smart QR Scanner</h2>
        
        {!scanResult ? (
          <div id="reader" style={{ width: "100%", borderRadius: 12, overflow: "hidden", background: "black" }}></div>
        ) : (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            {scanError ? (
              <>
                <div style={{ color: "#ef4444", fontSize: 40, marginBottom: 10 }}>❌</div>
                <h3 style={{ color: "#ef4444" }}>{scanError}</h3>
                <p style={{ color: "rgba(255,255,255,0.5)" }}>Resetting scanner...</p>
              </>
            ) : (
              <>
                <div style={{ color: "#10b981", fontSize: 40, marginBottom: 10 }}>✅</div>
                <h3 style={{ color: "#10b981" }}>Attendance Marked Successfully</h3>
                <p style={{ color: "rgba(255,255,255,0.5)" }}>Ready for next student...</p>
              </>
            )}
          </div>
        )}
      </div>

      {/* History Section */}
      <div style={{ background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 18, padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 15 }}>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 18, color: "#f8fafc" }}>Today's Attendance</h2>
          <span style={{ background: "rgba(16,185,129,0.1)", color: "#10b981", padding: "5px 10px", borderRadius: 8, fontSize: 13, fontWeight: "bold" }}>
            {attendances.length} Present
          </span>
        </div>
        
        {loading ? (
          <div style={{ color: "rgba(255,255,255,0.3)", textAlign: "center", marginTop: 20 }}>Loading...</div>
        ) : attendances.length === 0 ? (
          <div style={{ color: "rgba(255,255,255,0.3)", textAlign: "center", marginTop: 40 }}>No attendance recorded today yet.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {attendances.map(a => (
              <div key={a._id} style={{ display: "flex", justifyContent: "space-between", padding: 15, background: "rgba(255,255,255,0.03)", borderRadius: 12 }}>
                <div>
                  <div style={{ color: "white", fontWeight: "bold" }}>{a.studentName}</div>
                  <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>{a.studentId}</div>
                </div>
                <div style={{ color: "#10b981", fontWeight: "bold", fontSize: 14 }}>
                  {new Date(a.checkInTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <style>{`
        #reader__dashboard_section_csr span { color: white !important; }
        #reader__dashboard_section_csr button { background: #6366f1 !important; color: white !important; padding: 5px 10px; border-radius: 5px; border: none; cursor: pointer; }
        #reader a { display: none !important; }
      `}</style>
    </div>
  );
}
