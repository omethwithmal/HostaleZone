import React, { useEffect, useState } from "react";
import axios from "axios";

export default function RoomSelection() {
  const [selectedBlock, setSelectedBlock] = useState("A");
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  // booking form
  const [roomType, setRoomType] = useState("Single");
  const [roomNo, setRoomNo] = useState("");

  const token = localStorage.getItem("studentToken");

  const fetchRooms = async (block) => {
    setLoading(true);
    setSelectedBlock(block);
    setRoomNo("");

    try {
      const res = await axios.get(
        `http://localhost:5000/api/rooms?block=${block}`
      );
      setRooms(res.data);
    } catch (err) {
      console.log(err);
      alert("Failed to load rooms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms("A"); // default Block A
    // eslint-disable-next-line
  }, []);

  const handleBook = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("Please login again.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/rooms/book",
        {
          block: selectedBlock,
          roomType,
          roomNo, // optional
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Booking request sent successfully!");
      setRoomNo("");
      setRoomType("Single");
    } catch (err) {
      console.log(err);
      alert(err?.response?.data?.message || "Booking failed");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={{ marginBottom: 10 }}>Room Selection</h2>

      <div style={styles.blockRow}>
        <button
          style={selectedBlock === "A" ? styles.blockBtnActive : styles.blockBtn}
          onClick={() => fetchRooms("A")}
        >
          Block A (Boys)
        </button>

        <button
          style={selectedBlock === "B" ? styles.blockBtnActive : styles.blockBtn}
          onClick={() => fetchRooms("B")}
        >
          Block B (Girls)
        </button>

        <button
          style={selectedBlock === "C" ? styles.blockBtnActive : styles.blockBtn}
          onClick={() => fetchRooms("C")}
        >
          Block C (Lecturers)
        </button>
      </div>

      <div style={styles.card}>
        <h3 style={{ marginTop: 0 }}>Available Rooms - Block {selectedBlock}</h3>

        {loading ? (
          <p>Loading rooms...</p>
        ) : rooms.length === 0 ? (
          <p>No rooms found for this block (add rooms to DB first).</p>
        ) : (
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Room No</th>
                  <th style={styles.th}>Type</th>
                  <th style={styles.th}>Capacity</th>
                  <th style={styles.th}>Available Beds</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((r) => (
                  <tr key={r._id}>
                    <td style={styles.td}>{r.roomNo}</td>
                    <td style={styles.td}>{r.roomType}</td>
                    <td style={styles.td}>{r.capacity}</td>
                    <td style={styles.td}>{r.availableBeds}</td>
                    <td style={styles.td}>{r.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div style={styles.card}>
        <h3 style={{ marginTop: 0 }}>Send Booking Request</h3>

        <form onSubmit={handleBook}>
          <div style={styles.formRow}>
            <label style={styles.label}>Room Type</label>
            <select
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
              style={styles.input}
            >
              <option value="Single">Single</option>
              <option value="Sharing">Sharing</option>
            </select>
          </div>

          <div style={styles.formRow}>
            <label style={styles.label}>Room No (optional)</label>
            <input
              style={styles.input}
              value={roomNo}
              onChange={(e) => setRoomNo(e.target.value)}
              placeholder="Example: A-101"
            />
          </div>

          <button type="submit" style={styles.bookBtn}>
            Confirm Booking
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: 20 },
  blockRow: { display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 15 },
  blockBtn: {
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #ccc",
    background: "white",
    cursor: "pointer",
    fontWeight: 600,
  },
  blockBtnActive: {
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #1f6feb",
    background: "#1f6feb",
    color: "white",
    cursor: "pointer",
    fontWeight: 600,
  },
  card: {
    background: "white",
    padding: 15,
    borderRadius: 12,
    boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
    marginBottom: 15,
  },
  tableWrap: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", padding: 10, borderBottom: "1px solid #ddd" },
  td: { padding: 10, borderBottom: "1px solid #f0f0f0" },
  formRow: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    marginBottom: 12,
  },
  label: { fontWeight: 600 },
  input: {
    padding: 10,
    borderRadius: 10,
    border: "1px solid #ccc",
    outline: "none",
  },
  bookBtn: {
    width: "100%",
    padding: 12,
    borderRadius: 10,
    border: "none",
    background: "#16a34a",
    color: "white",
    fontWeight: 700,
    cursor: "pointer",
  },
};
