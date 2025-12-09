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
  useAlarmScheduler(
    alarms,
    setAlarms,
    ringingAlarm,
    setRingingAlarm,
    audioRef,
    audioBank
  );

  // ----------------------------------------
  // STOP + SNOOZE
  // ----------------------------------------
  // ---------- REPLACE YOUR stopAlarm() WITH THIS ----------
  const stopAlarm = () => {
    if (audioRef.current) audioRef.current.pause();

    const isSnoozed = ringingAlarm?.isSnoozeInstance;
    const finishedId = ringingAlarm?.id;

    // compute nowKey for marking lastTriggered (prevent re-trigger inside same minute)
    const now = new Date();
    const nowKey = `${now.getHours()}:${now.getMinutes()}`;

    // helper: today's day string (e.g. "Mon")
    const dayMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = dayMap[now.getDay()];

    setAlarms((prev) => {
      // 1) Remove temporary snooze if this was one
      let updated = prev.filter((a) => {
        if (isSnoozed && a.id === finishedId) return false;
        return true;
      });

      // 2) For original alarm: handle stop behaviour precisely
      updated = updated.map((a) => {
        if (!isSnoozed && a.id === finishedId) {
          // CASE A: once alarms -> keep current perfect behaviour (turn OFF)
          if (a.repeatMode === "once") {
            return {
              ...a,
              lastTriggered: nowKey,
              queuePending: false,
              isOn: false,
            };
          }

          // CASE B: custom with NO days selected -> behaves like once (turn OFF)
          if (
            a.repeatMode === "custom" &&
            (!a.repeatDays || a.repeatDays.length === 0)
          ) {
            return {
              ...a,
              lastTriggered: nowKey,
              queuePending: false,
              isOn: false,
              // keep repeatMode as custom or convert to once if you prefer:
              // repeatMode: "once"
            };
          }

          // CASE C: custom WITH days -> consume today's slot only
          if (a.repeatMode === "custom" && Array.isArray(a.repeatDays)) {
            if (a.repeatDays.includes(today)) {
              const updatedDays = a.repeatDays.filter((d) => d !== today);
              return {
                ...a,
                repeatDays: updatedDays,
                lastTriggered: nowKey,
                queuePending: false,
                isOn: updatedDays.length > 0, // turn OFF if no days left
              };
            } else {
              // alarm shouldn't have rung if today not selected, but defensively mark lastTriggered
              return {
                ...a,
                lastTriggered: nowKey,
                queuePending: false,
              };
            }
          }

          // CASE D: other repeating types (daily / weekdays / weekends / etc.)
          // Mark lastTriggered so we don't retrigger in same minute, keep it ON.
          return {
            ...a,
            lastTriggered: nowKey,
            queuePending: false,
          };
        }
        return a;
      });

      return updated;
    });

    // clear ringingAlarm to allow next in queue
    setRingingAlarm(null);
  };

  const handleSnooze = () => {
    const origin = ringingAlarm;
    if (!origin) return;

    const snoozeMins = 5;

    // Prevent creating duplicate snooze instance for same parent while one already exists
    const exists = alarms.some(
      (a) => a.parentId === origin.id && a.isSnoozeInstance && a.isOn
    );
    if (exists) {
      // ignore extra snooze presses while a snooze instance is active
      // optionally you can provide user feedback here
      // e.g. toast "Snooze already scheduled"
      // but for now just return
      // still stop the current ringing (so user can press Stop)
      if (audioRef.current) audioRef.current.pause();
      setRingingAlarm(null);
      return;
    }

    const [time, ampm] = origin.time.split(" ");
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

    const snoozeAlarm = {
      id: origin.id + "_snooze_" + Date.now(),
      parentId: origin.id,
      createdAt: Date.now(),
      isSnoozeInstance: true,
      queuePending: false,
      time: newTime,
      name: (origin.name || "Alarm") + " (Snoozed)",
      repeatMode: "once",
      repeatDays: [],
      ringtone: origin.ringtone,
      vibrate: origin.vibrate,
      snooze: origin.snooze,
      isOn: true,
      lastTriggered: null,
    };

    // Add snoozed alarm (only once)
    setAlarms((prev) => [...prev, snoozeAlarm]);

    // Stop ringing original (and mark lastTriggered so it won't re-trigger)
    if (audioRef.current) audioRef.current.pause();

    const now = new Date();
    const nowKey = `${now.getHours()}:${now.getMinutes()}`;

    setAlarms((prev) =>
      prev.map((a) =>
        a.id === origin.id
          ? {
              ...a,
              lastTriggered: nowKey,
              queuePending: false,
              isOn: a.repeatMode === "once" ? false : a.isOn,
            }
          : a
      )
    );

    setRingingAlarm(null);
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
