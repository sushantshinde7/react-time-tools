import React, { useState } from "react";
import "./AlarmPopup.css";
import TimePickerWheel from "./TimePickerWheel";

const AlarmPopup = ({ onClose, onSave }) => {
  const [alarmTime, setAlarmTime] = useState({
    hour: 7,
    minute: "00",
    ampm: "AM",
  });

  return (
    <div className="alarm-popup-overlay">
      <div className="alarm-popup">

        {/* Header (fixed) */}
        <div className="popup-header">
          <button className="popup-close" onClick={onClose}>×</button>
          <h3 className="popup-title">New Alarm</h3>
          <button className="popup-save" onClick={() => onSave(alarmTime)}>✓</button>
        </div>

        {/* Scrollable body */}
        <div className="popup-scroll">

          {/* Ring in text */}
          <p className="ring-time-text">Alarm will ring in 23h 52m</p>

          {/* Time Picker Wheel */}
          <div className="timepicker-wrapper">
            <TimePickerWheel value={alarmTime} onChange={setAlarmTime} />
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

        </div> {/* /popup-scroll */}
      </div>
    </div>
  );
};

export default AlarmPopup;

