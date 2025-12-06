import React, { useState, useRef, useEffect } from "react";
import "./Alarm.css";
import AlarmPopup from "./AlarmPopup";
import AlarmItem from "./AlarmItem";
import RingingModal from "./RingingModal";

import useAlarmScheduler from "../../utils/useAlarmScheduler";

const Alarm = () => {
  // ----------------------------------------
  // LOCAL STORAGE
  // ----------------------------------------
  const [alarms, setAlarms] = useState(() => {
    try {
      const saved = localStorage.getItem("alarms");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [ringingAlarm, setRingingAlarm] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const navRef = useRef(null);

  // ----------------------------------------
  // AUDIO BANK (PRELOADED) + GLOBAL AUDIO REF
  // ----------------------------------------
  const audioBank = useRef({});
  const audioRef = useRef(null);

  useEffect(() => {
    const sounds = [
      "airtel",
      "docomo",
      "realme",
      "reliance",
      "galaxy_1",
      "galaxy_2",
      "nokia_classic",
    ];

    sounds.forEach((name) => {
      audioBank.current[name] = new Audio(`/src/sounds/${name}.mp3`);
    });
  }, []);

  // ----------------------------------------
  // SAVE TO LOCAL STORAGE (debounced 150ms)
  // ----------------------------------------
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem("alarms", JSON.stringify(alarms));
    }, 150);

    return () => clearTimeout(timer); // cleanup if alarms change quickly
  }, [alarms]);

  // ----------------------------------------
  // CLICK OUTSIDE EDIT MODE
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

  // ----------------------------------------
  // SCHEDULER HOOK
  // (now receives audioBank + audioRef)
  // ----------------------------------------
  useAlarmScheduler(alarms, setAlarms, setRingingAlarm, audioRef, audioBank);

  // ----------------------------------------
  // STOP + SNOOZE
  // ----------------------------------------
  const stopAlarm = () => {
    if (audioRef.current) audioRef.current.pause();
    setRingingAlarm(null);
  };

  const handleSnooze = () => {
    const snoozeMins = 5;

    setAlarms((prev) =>
      prev.map((a) => {
        if (a.id !== ringingAlarm.id) return a;

        // Convert current alarm time to Date()
        const [time, ampm] = a.time.split(" ");
        let [hh, mm] = time.split(":").map(Number);

        if (ampm === "PM" && hh !== 12) hh += 12;
        if (ampm === "AM" && hh === 12) hh = 0;

        const d = new Date();
        d.setHours(hh, mm + snoozeMins);

        let newH = d.getHours();
        const newM = d.getMinutes();

        const newAmpm = newH >= 12 ? "PM" : "AM";
        newH = newH % 12 || 12;

        const newTime =
          `${String(newH).padStart(2, "0")}:` +
          `${String(newM).padStart(2, "0")} ${newAmpm}`;

        return { ...a, time: newTime, isOn: true };
      })
    );

    stopAlarm();
  };

  // ----------------------------------------
  // UI
  // ----------------------------------------
  return (
    <div className="alarm-container">
      {/* NAV */}
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

      {/* LIST */}
      <div className="alarm-list">
        {alarms.length === 0 ? (
          <p className="alarm-list-placeholder">⏰ No alarms added</p>
        ) : (
          alarms.map((alarm) => (
            <div className="alarm-item-wrapper" key={alarm.id}>
              <AlarmItem
                alarm={alarm}
                onToggle={(id) =>
                  setAlarms((prev) =>
                    prev.map((a) => (a.id === id ? { ...a, isOn: !a.isOn } : a))
                  )
                }
              />
            </div>
          ))
        )}
      </div>

      {/* POPUP */}
      {showPopup && (
        <AlarmPopup
          onClose={() => setShowPopup(false)}
          onSave={(newAlarm) => {
            setAlarms((p) => [...p, newAlarm]);
            setShowPopup(false);
          }}
        />
      )}

      {/* RINGING MODAL */}
      {ringingAlarm && (
        <RingingModal
          alarm={ringingAlarm}
          onStop={stopAlarm}
          onSnooze={handleSnooze}
        />
      )}
    </div>
  );
};

export default Alarm;
