import React from "react";
import "./RingingModal.css";

export default function RingingModal({ alarm, onStop, onSnooze }) {
  if (!alarm) return null;

  return (
    <div className="ringing-overlay">
      <div className="ringing-card scale-in">

        {/* Ripple Background Animation */}
        <div className="ring-wrapper">
          <div className="ringing-animation">
            {[...Array(12)].map((_, i) => (
              <div key={i} className={`rect rect-${i + 1}`}></div>
            ))}
          </div>

          {/* Time centered inside rings */}
          <h1 className="ringing-time">{alarm.time}</h1>
        </div>

        {/* Alarm Label */}
        <p className="ringing-name">{alarm.name || "Alarm"}</p>

        {/* Buttons */}
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


