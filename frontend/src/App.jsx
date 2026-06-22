import { useEffect, useState } from "react";
import "./App.css";
import Login from "./Login";
import Home from "./Home";

function App() {
  const [page, setPage] = useState("home");
  const [role, setRole] = useState(""); // admin / user
  const [slots, setSlots] = useState([]);
  const [newSlot, setNewSlot] = useState("");

  // ✅ DEBUG: ROLE TRACKING (IMPORTANT)
  useEffect(() => {
    console.log("🔥 ROLE UPDATED:", role);
  }, [role]);

  // LOAD SLOTS
  const loadSlots = () => {
    fetch("http://localhost:8080/slots")
      .then((res) => res.json())
      .then((data) => {
        console.log("📦 SLOTS LOADED:", data);
        setSlots(data);
      })
      .catch((err) => console.log("❌ SLOT LOAD ERROR:", err));
  };

  useEffect(() => {
    if (page === "dashboard") {
      loadSlots();
    }
  }, [page]);

  // LOGIN
  const handleLogin = (userRole) => {
  const normalizedRole = userRole.toLowerCase(); // 🔥 FIX

  console.log("🚀 LOGIN ROLE RECEIVED:", normalizedRole);

  setRole(normalizedRole);
  setPage("dashboard");
};

  // LOGOUT
  const logout = () => {
    setRole("");
    setPage("home");
  };

  // BOOK SLOT (USER ONLY)
  const bookSlot = (slot) => {
    fetch(`http://localhost:8080/slots/${slot.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...slot,
        status: "BOOKED",
        vehicleNumber: "AP09AB1234",
        userName: "User",
      }),
    })
      .then(() => loadSlots())
      .catch((err) => console.log("BOOK ERROR:", err));
  };

  // CANCEL SLOT (ADMIN ONLY)
  const cancelSlot = (slot) => {
    fetch(`http://localhost:8080/slots/cancel/${slot.id}`, {
      method: "PUT",
    })
      .then(() => loadSlots())
      .catch((err) => console.log("CANCEL ERROR:", err));
  };

  // ADD SLOT (ADMIN ONLY)
  const addSlot = () => {
    if (!newSlot) {
      alert("Enter slot number");
      return;
    }

    fetch("http://localhost:8080/slots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slotNumber: newSlot,
        status: "AVAILABLE",
      }),
    })
      .then(() => {
        setNewSlot("");
        loadSlots();
      })
      .catch((err) => console.log("ADD SLOT ERROR:", err));
  };

  // ---------------- HOME ----------------
  if (page === "home") {
    return <Home onStart={() => setPage("login")} />;
  }

  // ---------------- LOGIN ----------------
  if (page === "login") {
    return <Login onLogin={handleLogin} />;
  }

  // ---------------- DASHBOARD ----------------
  return (
    <div className="dashboard">

      {/* NAVBAR */}
      <div className="navbar">
        <h2>🚗 SmartPark</h2>

        <div>
          <button onClick={() => setPage("dashboard")}>Dashboard</button>
          <button onClick={logout} style={{ background: "red" }}>
            Logout
          </button>
        </div>
      </div>

      {/* ROLE SHOW (IMPORTANT DEBUG UI) */}
      <div style={{ padding: "10px", color: "blue" }}>
        Current Role: <b>{role || "NOT SET"}</b>
      </div>

      {/* ADMIN PANEL */}
      {role === "admin" && (
        <div className="admin-box">
          <h3>👨‍💼 Admin Panel</h3>

          <input
            placeholder="Enter Slot Number"
            value={newSlot}
            onChange={(e) => setNewSlot(e.target.value)}
          />

          <button onClick={addSlot}>➕ Add Slot</button>
        </div>
      )}

      {/* STATS */}
      <div className="stats">
        <div>Total: {slots.length}</div>
        <div>
          Available: {slots.filter((s) => s.status === "AVAILABLE").length}
        </div>
        <div>
          Booked: {slots.filter((s) => s.status === "BOOKED").length}
        </div>
      </div>

      {/* SLOTS */}
      <div className="slots">
        {slots.map((slot) => (
          <div
            key={slot.id}
            className={`card ${
              slot.status === "AVAILABLE" ? "available" : "booked"
            }`}
          >
            <h2>{slot.slotNumber}</h2>
            <p>Status: {slot.status}</p>

            {slot.status === "BOOKED" && (
              <p>Vehicle: {slot.vehicleNumber}</p>
            )}

            {/* USER VIEW */}
            {role === "user" && (
              <>
                {slot.status === "AVAILABLE" ? (
                  <button onClick={() => bookSlot(slot)}>Book Slot</button>
                ) : (
                  <button disabled>Booked</button>
                )}
              </>
            )}

            {/* ADMIN VIEW */}
            {role === "admin" && slot.status === "BOOKED" && (
              <button onClick={() => cancelSlot(slot)}>
                Cancel Booking
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;