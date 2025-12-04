import React, { useState, useEffect, useRef } from "react";
import "./AlarmPopup.css";
import TimeStepper from "./TimeStepper";

const AlarmPopup = ({ onClose, onSave }) => {
  const getCurrentTime = () => {
    const now = new Date();
    let h = now.getHours();
    const m = now.getMinutes();
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;

    return `${String(h).padStart(2, "0")}:${String(m).padStart(
      2,
      "0"
    )} ${ampm}`;
  };

  // ---- Phase 1 states ----
  const [alarmTime, setAlarmTime] = useState(getCurrentTime());
  const [alarmName, setAlarmName] = useState("");
  const [ringtone, setRingtone] = useState("airtel");
  const [ringtoneOpen, setRingtoneOpen] = useState(false);

  const ringtoneMap = {
    airtel: "/src/sounds/airtel.mp3",
    docomo: "/src/sounds/docomo.mp3",
    realme: "/src/sounds/realme.mp3",
    reliance: "/src/sounds/reliance.mp3",
    galaxy1: "/src/sounds/galaxy_1.mp3",
    galaxy2: "/src/sounds/galaxy_2.mp3",
    nokia: "/src/sounds/nokia_classic.mp3"
  };

  const ringtoneOptions = Object.keys(ringtoneMap);

  // 🔵 AUDIO REF FOR PREVIEW
  const audioRef = useRef(null);

  // Repeat section
  const [repeatMode, setRepeatMode] = useState("once");
  const [repeatDays, setRepeatDays] = useState([]);

  const toggleDay = (day) => {
    setRepeatDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Toggles
  const [vibrate, setVibrate] = useState(true);
  const [snooze, setSnooze] = useState(true);

  // ---------------------------
  // Remaining time calculation
  // ---------------------------
  const [remainingTime, setRemainingTime] = useState("");

  const calculateRemainingTime = (timeStr) => {
    if (!timeStr) return "";

    const [time, ampm] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    // Convert to 24h format
    if (ampm === "PM" && hours !== 12) hours += 12;
    if (ampm === "AM" && hours === 12) hours = 0;

    const now = new Date();
    const alarm = new Date();

    alarm.setHours(hours, minutes, 0, 0);

    if (alarm <= now) alarm.setDate(alarm.getDate() + 1);

    const diffMs = alarm - now;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    const hrs = Math.floor(diffMinutes / 60);
    const mins = diffMinutes % 60;

    return `${hrs}h ${mins}m`;
  };

  // Update remaining time whenever alarm time changes
  useEffect(() => {
    setRemainingTime(calculateRemainingTime(alarmTime));
  }, [alarmTime]);

  const handleSave = () => {
    const newAlarm = {
      id: Date.now(),
      time: alarmTime,
      name: alarmName,
      repeatMode,
      repeatDays,
      ringtone,
      vibrate,
      snooze,
      isOn: true,
    };

    console.log("NEW ALARM OBJECT:", newAlarm);

    onSave(newAlarm);
  };

  return (
    <div className="alarm-popup-overlay">
      <div className="alarm-popup">
        {/* Header */}
        <div className="popup-header">
          <button className="popup-close" onClick={onClose}>×</button>
          <h3 className="popup-title">New Alarm</h3>
          <button className="popup-save" onClick={handleSave}>✓</button>
        </div>

        <div className="popup-scroll">
          <p className="ring-time-text">
            Alarm will ring in <span>{remainingTime || "–"}</span>
          </p>

          {/* Time */}
          <div className="time-stepper-wrapper">
            <TimeStepper initialTime={alarmTime} onTimeSelect={setAlarmTime} />
          </div>

          {/* Repeat */}
          <div className="popup-section">
            <h4>Repeat</h4>

            <div className="repeat-section">
              <button
                className={`repeat-btn ${repeatMode === "once" ? "active" : ""}`}
                onClick={() => setRepeatMode("once")}
              >
                Ring Once
              </button>

              <button
                className={`repeat-btn ${repeatMode === "custom" ? "active" : ""}`}
                onClick={() => setRepeatMode("custom")}
              >
                Custom
              </button>
            </div>

            {/* Custom days */}
            <div className={`repeat-days-row-wrapper ${repeatMode === "custom" ? "open" : ""}`}>
              <div className="repeat-days-row">
                {days.map((day) => (
                  <div
                    key={day}
                    className={`day-chip ${repeatDays.includes(day) ? "selected" : ""}`}
                    onClick={() => toggleDay(day)}
                  >
                    {day}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Alarm Name */}
          <div className="popup-section">
            <h4>Alarm Name</h4>
            <input
              type="text"
              className="text-input"
              placeholder="Optional"
              value={alarmName}
              onChange={(e) => setAlarmName(e.target.value)}
            />
          </div>

          {/* Ringtone */}
          <div className="popup-section">
            <h4>Ringtone</h4>

            <div
              className="ringtone-selected"
              onClick={() => setRingtoneOpen(!ringtoneOpen)}
            >
              {ringtone}
              <span className={`rt-arrow ${ringtoneOpen ? "open" : ""}`}>▼</span>
            </div>

            <div className={`ringtone-list-wrapper ${ringtoneOpen ? "open" : ""}`}>
              <div className="ringtone-list">
                {ringtoneOptions.map((name) => (
                  <div
                    key={name}
                    className={`ringtone-item ${ringtone === name ? "active" : ""}`}
                    onClick={() => {
                      setRingtone(name);
                      setRingtoneOpen(false);

                      // 🔊 PREVIEW — 3 lines
                      if (audioRef.current) audioRef.current.pause();
                      audioRef.current = new Audio(ringtoneMap[name]);
                      audioRef.current.play();
                    }}
                  >
                    {name}
                    {ringtone === name && <span className="rt-check">✓</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Toggles */}
          <div className="popup-section toggle-wrapper">
            <div className="toggle-row">
              <span>Vibrate</span>
              <label className="popup-switch">
                <input
                  type="checkbox"
                  checked={vibrate}
                  onChange={(e) => setVibrate(e.target.checked)}
                />
                <span className="popup-slider"></span>
              </label>
            </div>

            <div className="toggle-row">
              <span>Snooze</span>
              <label className="popup-switch">
                <input
                  type="checkbox"
                  checked={snooze}
                  onChange={(e) => setSnooze(e.target.checked)}
                />
                <span className="popup-slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlarmPopup;

