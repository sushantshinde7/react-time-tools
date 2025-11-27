import React, { useState, useRef, useEffect } from "react";
import "./Alarm.css";
import AlarmPopup from "./AlarmPopup";
import AlarmItem from "./AlarmItem";

const Alarm = () => {
  // ----------------------------------------
  // SAFE LOCALSTORAGE INITIALIZATION
  // ----------------------------------------
  const [alarms, setAlarms] = useState(() => {
    try {
      const saved = localStorage.getItem("alarms");
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const [editMode, setEditMode] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const navRef = useRef(null);

  // SAVE ON EVERY CHANGE
  useEffect(() => {
    localStorage.setItem("alarms", JSON.stringify(alarms));
  }, [alarms]);

  // CLOSE EDIT MODE IF CLICK OUTSIDE
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

        {editMode && (
          <button
            className="nav-btn danger-btn"
            onClick={() => {
              setAlarms([]);
              localStorage.removeItem("alarms");
            }}
          >
            Clear All
          </button>
        )}

        <h2 className="nav-title">Alarm</h2>

        <button className="nav-btn add-btn" onClick={() => setShowPopup(true)}>
          +
        </button>
      </div>

      {/* ----------------------------------------
          ALARM LIST
      ----------------------------------------- */}
      <div className="alarm-list">
        {alarms.length === 0 ? (
          <p className="alarm-list-placeholder">
            ⏰ No alarms added
          </p>
        ) : (
          alarms.map((alarm) => (
            <div className="alarm-card" key={alarm.id}>
              <AlarmItem
                alarm={alarm}
                onToggle={(id) =>
                  setAlarms((prev) =>
                    prev.map((a) =>
                      a.id === id ? { ...a, isOn: !a.isOn } : a
                    )
                  )
                }
              />
            </div>
          ))
        )}
      </div>

      {/* ----------------------------------------
          POPUP
      ----------------------------------------- */}
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
