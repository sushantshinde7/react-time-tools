import React, { useState, useRef, useEffect } from "react";
import "./Alarm.css";
import AlarmPopup from "./AlarmPopup";

const Alarm = () => {
  // ----------------------------------------
  // SAFE LOCALSTORAGE INITIALIZATION
  // ----------------------------------------
  const [alarms, setAlarms] = useState(() => {
    try {
      const saved = localStorage.getItem("alarms");
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.warn("Failed to parse alarms from localStorage", e);
      return [];
    }
  });

  const [editMode, setEditMode] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const navRef = useRef(null);

  // ----------------------------------------
  // SAVE TO LOCALSTORAGE ON EVERY UPDATE
  // ----------------------------------------
  useEffect(() => {
    localStorage.setItem("alarms", JSON.stringify(alarms));
  }, [alarms]);

  // ----------------------------------------
  // CLOSE EDIT MODE ON CLICK OUTSIDE NAVBAR
  // ----------------------------------------
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
      {/* ----------------------------------------
          TOP NAVBAR
      ----------------------------------------- */}
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

      {/* ----------------------------------------
          ALARM LIST (TEMP: PLACEHOLDER ALWAYS SHOWN)
      ----------------------------------------- */}
      <div className="alarm-list">
        <p className="alarm-list-placeholder">
          <span role="img" aria-label="alarm">
            ⏰
          </span>{" "}
          No alarms added
        </p>

        {/* Later: dynamic alarms will replace above placeholder */}
      </div>

      {/* ----------------------------------------
          POPUP FOR ADDING ALARMS
      ----------------------------------------- */}
      {showPopup && (
        <AlarmPopup
          onClose={() => setShowPopup(false)}
          onSave={(newAlarm) => {
            // TEMP setup: store what popup gives (string for now)
            setAlarms((prev) => [...prev, newAlarm]);

            setShowPopup(false);
          }}
        />
      )}
    </div>
  );
};

export default Alarm;
