import React, { useState, useEffect, useRef } from "react";
import "./AlarmPopup.css";
import TimeStepper from "./TimeStepper";

const AlarmPopup = ({ onClose, onSave }) => {
  // -----------------------------
  // TIME HELPERS
  // -----------------------------
  const getCurrentTime = () => {
    const now = new Date();
    let h = now.getHours();
    const m = now.getMinutes();
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")} ${ampm}`;
  };

  const [alarmTime, setAlarmTime] = useState(getCurrentTime());
  const [alarmName, setAlarmName] = useState("");

  // ringtone name only → audio handled globally in Alarm.jsx
  const [ringtone, setRingtone] = useState("airtel");
  const [ringtoneOpen, setRingtoneOpen] = useState(false);

  const ringtoneOptions = [
    "airtel",
    "docomo",
    "realme",
    "reliance",
    "galaxy_1",
    "galaxy_2",
    "nokia_classic",
  ];

  // preview audio (for user testing ringtone)
  const previewRef = useRef(null);

  // -----------------------------
  // REPEAT MODE
  // -----------------------------
  const [repeatMode, setRepeatMode] = useState("once");
  const [repeatDays, setRepeatDays] = useState([]);
  const toggleDay = (day) => {
    setRepeatDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const [vibrate, setVibrate] = useState(true);
  const [snooze, setSnooze] = useState(true);

  // -----------------------------
  // REMAINING TIME CALC
  // -----------------------------
  const [remainingTime, setRemainingTime] = useState("");
  const calculateRemainingTime = (timeStr) => {
    if (!timeStr) return "";
    const [time, ampm] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (ampm === "PM" && hours !== 12) hours += 12;
    if (ampm === "AM" && hours === 12) hours = 0;

    const now = new Date();
    const alarm = new Date();
    alarm.setHours(hours, minutes, 0, 0);
    if (alarm <= now) alarm.setDate(alarm.getDate() + 1);

    const diffMs = alarm - now;
    const diffMinutes = Math.ceil(diffMs / (1000 * 60));
    const hrs = Math.floor(diffMinutes / 60);
    const mins = diffMinutes % 60;

    return hrs === 0 ? `${mins}m` : `${hrs}h ${mins}m`;
  };

  useEffect(() => {
    setRemainingTime(calculateRemainingTime(alarmTime));
  }, [alarmTime]);

  // -----------------------------
  // SAVE
  // -----------------------------
  const handleSave = () => {
  const newAlarm = {
    id: Date.now(),
    createdAt: Date.now(),     // 🆕 needed for queue order
    queuePending: false,        // 🆕 used for scheduler queueing
    time: alarmTime,
    name: alarmName,
    repeatMode,
    repeatDays,
    ringtone,
    vibrate,
    snooze,
    isOn: true,
    lastTriggered: null,
  };

    onSave(newAlarm);
  };

  // -----------------------------
  // Smooth open/close animation
  // -----------------------------
  const [isVisible, setIsVisible] = useState(true);
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 280);
  };

  // -----------------------------
  // PREVIEW RINGTONE (small test)
  // -----------------------------
  const previewSound = (name) => {
    if (previewRef.current) {
      previewRef.current.pause();
      previewRef.current.currentTime = 0;
    }

    previewRef.current = new Audio(`/src/sounds/${name}.mp3`);
    previewRef.current.play();
  };

  return (
    <div className={`alarm-popup-overlay ${isVisible ? "fade-in" : "fade-out"}`}>
      <div className={`alarm-popup ${isVisible ? "slide-up" : "slide-down"}`}>

        {/* Header */}
        <div className="popup-header">
          <button className="popup-close" onClick={handleClose}>×</button>
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
                      previewSound(name);
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
