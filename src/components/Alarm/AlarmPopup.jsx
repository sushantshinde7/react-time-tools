import React, { useState } from "react";
import "./AlarmPopup.css";
import TimePickerWheel from "./TimePickerWheel";

const AlarmPopup = ({ onClose, onSave }) => {
  const [alarmTime, setAlarmTime] = useState("07:00 AM");

  const handleSave = () => {
    onSave(alarmTime);
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
          {/* Ring text */}
          <p className="ring-time-text">Alarm will ring in 23h 52m</p>

          {/* Inline Time Picker */}
          <div className="timepicker-wrapper">
            <TimePickerWheel
              initialTime={alarmTime}
              onTimeSelect={setAlarmTime}
            />
          </div>

          {/* Repeat Section */}
          <div className="repeat-section">
            <button className="repeat-btn active">Ring Once</button>
            <button className="repeat-btn">Custom ▼</button>
          </div>

          {/* Alarm Name */}
          <div className="input-row">
            <label>Alarm Name</label>
            <input type="text" className="text-input" placeholder="Optional" />
          </div>

          {/* Ringtone */}
          <div className="input-row">
            <label>Ringtone</label>
            <select className="select-input">
              <option>Default</option>
            </select>
          </div>

          {/* Vibrate */}
          <div className="toggle-row">
            <span>Vibrate</span>
            <label className="switch">
              <input type="checkbox" defaultChecked />
              <span className="slider"></span>
            </label>
          </div>

          {/* Snooze */}
          <div className="toggle-row">
            <span>Snooze</span>
            <label className="switch">
              <input type="checkbox" defaultChecked />
              <span className="slider"></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlarmPopup;
