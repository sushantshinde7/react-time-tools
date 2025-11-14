import React, { useState, useRef, useEffect, useCallback } from "react";
import "./Alarm.css";

const Alarm = () => {
  const [alarms, setAlarms] = useState(() => {
    const saved = localStorage.getItem("alarms");
    return saved ? JSON.parse(saved) : [];
  });

  const [editMode, setEditMode] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const navRef = useRef(null);

  // Save alarms to localStorage
  useEffect(() => {
    localStorage.setItem("alarms", JSON.stringify(alarms));
  }, [alarms]);

  // Close edit when clicking outside navbar
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (editMode && navRef.current && !navRef.current.contains(e.target)) {
        setEditMode(false);
      }
    };

    if (editMode) {
      document.addEventListener("mousedown", handleClickOutside);
    }
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

        <button
          className="nav-btn add-btn"
          onClick={() => setShowTimePicker(true)}
        >
          +
        </button>
      </div>

      {/* Empty State */}
      <div className="alarm-list">
        {alarms.length === 0 ? (
          <p className="placeholder">No alarms added</p>
        ) : (
          <div> {/* We will render alarms here later */} </div>
        )}
      </div>

      {/* Time Picker Popup (coming later) */}
      {showTimePicker && (
        <div className="picker-popup">
          {/* Add your scroll-wheel time picker here */}
        </div>
      )}
    </div>
  );
};

export default Alarm;

