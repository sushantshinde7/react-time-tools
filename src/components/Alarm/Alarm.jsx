import React, { useState, useRef, useEffect } from "react";
import "./Alarm.css";
import AlarmPopup from "./AlarmPopup";

const Alarm = () => {
  const [alarms, setAlarms] = useState(() => {
    const saved = localStorage.getItem("alarms");
    return saved ? JSON.parse(saved) : [];
  });

  const [editMode, setEditMode] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const navRef = useRef(null);

  // Save alarms to localStorage
  useEffect(() => {
    localStorage.setItem("alarms", JSON.stringify(alarms));
  }, [alarms]);

  // Close editMode if clicked outside nav
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (editMode && navRef.current && !navRef.current.contains(e.target)) {
        setEditMode(false);
      }
    };

    if (editMode) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [editMode]);

  return (
    <div className="alarm-container">
      {/* Navbar */}
      <div className="alarm-nav" ref={navRef}>
        <button
          className={`nav-btn ${editMode ? "active" : ""}`}
          onClick={() => setEditMode((p) => !p)}
        >
          {editMode ? "Done" : "Edit"}
        </button>

        <h2 className="nav-title">Alarm</h2>

        <button className="nav-btn add-btn" onClick={() => setShowPopup(true)}>
          +
        </button>
      </div>

      {/* Alarm List / Empty State */}
      <div className="alarm-list">
        <p className="alarm-list-placeholder">
          <span role="img" aria-label="alarm">
            ⏰
          </span>{" "}
          No alarms added
        </p>
      </div>

      {/* Alarm Popup */}
      {showPopup && (
        <AlarmPopup
          onClose={() => setShowPopup(false)}
          onSave={(newAlarm) => {
            setAlarms((prev) => [...prev, newAlarm]);
            setShowPopup(false);
          }}
        />
      )}
    </div>
  );
};

export default Alarm;
