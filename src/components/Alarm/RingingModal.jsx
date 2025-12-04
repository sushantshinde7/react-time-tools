import React from "react";
import "./RingingModal.css";

export default function RingingModal({ alarm, onStop, onSnooze }) {
  if (!alarm) return null; // do NOT render if no alarm is ringing

  return (
    <div className="ringing-overlay">
      <div className="ringing-box">
        <h1 className="ringing-time">{alarm.time}</h1>
        <p className="ringing-name">{alarm.name || "Alarm"}</p>

        <div className="ringing-buttons">
          <button className="stop-btn" onClick={onStop}>Stop</button>

          {alarm.snooze && (
            <button className="snooze-btn" onClick={onSnooze}>Snooze</button>
          )}
        </div>
      </div>
    </div>
  );
}
