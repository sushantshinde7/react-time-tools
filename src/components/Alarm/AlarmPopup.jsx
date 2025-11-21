import React, { useState, useEffect } from "react";
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
  const [ringtone, setRingtone] = useState("Default");
  const [repeatMode, setRepeatMode] = useState("once"); // once | custom
  const [vibrate, setVibrate] = useState(true);
  const [snooze, setSnooze] = useState(true);

  // ---------------------------
  // 🔵 Dynamic remaining time
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

    // If alarm already passed → add 1 day
    if (alarm <= now) {
      alarm.setDate(alarm.getDate() + 1);
    }

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
  // ---------------------------


  const handleSave = () => {
    const newAlarm = {
      id: Date.now(),
      time: alarmTime,
      name: alarmName,
      repeat: repeatMode,
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
        <button className="popup-close" onClick={onClose}>
          ×
        </button>
        <h3 className="popup-title">New Alarm</h3>
        <button className="popup-save" onClick={handleSave}>
          ✓
        </button>
      </div>

      {/* Scrollable body */}
      <div className="popup-scroll">
        <p className="ring-time-text">
          Alarm will ring in {remainingTime || "–"}
        </p>

        {/* Time */}
        <h4>Time</h4>
        <div className="time-stepper-wrapper">
          <TimeStepper initialTime={alarmTime} onTimeSelect={setAlarmTime} />
        </div>

        {/* Repeat */}
        <div className="popup-section">
          <h4>Repeat</h4>
          <div className="repeat-section">
            <button
              id="repeat-once"
              name="repeatMode"
              className={`repeat-btn ${repeatMode === "once" ? "active" : ""}`}
              onClick={() => setRepeatMode("once")}
            >
              Ring Once
            </button>

            <button
              id="repeat-custom"
              name="repeatMode"
              className={`repeat-btn ${repeatMode === "custom" ? "active" : ""}`}
              onClick={() => setRepeatMode("custom")}
            >
              Custom ▼
            </button>
          </div>
        </div>

        {/* Alarm Name */}
        <div className="popup-section">
          <h4>Alarm Name</h4>
          <input
            id="alarmName"
            name="alarmName"
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
          <select
            id="ringtone"
            name="ringtone"
            className="select-input"
            value={ringtone}
            onChange={(e) => setRingtone(e.target.value)}
          >
            <option value="Default">Default</option>
          </select>
        </div>

        {/* Toggles */}
        <div className="popup-section toggle-wrapper">
          <div className="toggle-row">
            <span>Vibrate</span>
            <label className="switch" htmlFor="vibrate">
              <input
                id="vibrate"
                name="vibrate"
                type="checkbox"
                checked={vibrate}
                onChange={(e) => setVibrate(e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="toggle-row">
            <span>Snooze</span>
            <label className="switch" htmlFor="snooze">
              <input
                id="snooze"
                name="snooze"
                type="checkbox"
                checked={snooze}
                onChange={(e) => setSnooze(e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
);
};

export default AlarmPopup;
