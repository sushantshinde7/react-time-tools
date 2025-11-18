import React, { useState } from "react";
import "./TimePickerWheel.css";

export default function TimePickerWheel({ onTimeSelect, initialTime = "07:00 AM" }) {
  const [hour, setHour] = useState(parseInt(initialTime.split(":")[0]));
  const [minute, setMinute] = useState(parseInt(initialTime.split(":")[1]));
  const [ampm, setAmPm] = useState(initialTime.includes("AM") ? "AM" : "PM");

  const pad = (num) => String(num).padStart(2, "0");

  const handleTimeChange = (h, m, ap) => {
    const timeStr = `${pad(h)}:${pad(m)} ${ap}`;
    onTimeSelect && onTimeSelect(timeStr);
  };

  const incrementHour = () => {
    const newHour = hour === 12 ? 1 : hour + 1;
    setHour(newHour);
    handleTimeChange(newHour, minute, ampm);
  };

  const decrementHour = () => {
    const newHour = hour === 1 ? 12 : hour - 1;
    setHour(newHour);
    handleTimeChange(newHour, minute, ampm);
  };

  const incrementMinute = () => {
    let newMinute = minute + 1;
    let newHour = hour;
    let newAmPm = ampm;
    if (newMinute === 60) {
      newMinute = 0;
      newHour = hour === 12 ? 1 : hour + 1;
      if (newHour === 12) newAmPm = ampm === "AM" ? "PM" : "AM";
    }
    setMinute(newMinute);
    setHour(newHour);
    setAmPm(newAmPm);
    handleTimeChange(newHour, newMinute, newAmPm);
  };

  const decrementMinute = () => {
    let newMinute = minute - 1;
    let newHour = hour;
    let newAmPm = ampm;
    if (newMinute === -1) {
      newMinute = 59;
      newHour = hour === 1 ? 12 : hour - 1;
      if (newHour === 11) newAmPm = ampm === "AM" ? "PM" : "AM";
    }
    setMinute(newMinute);
    setHour(newHour);
    setAmPm(newAmPm);
    handleTimeChange(newHour, newMinute, newAmPm);
  };

  const toggleAmPm = () => {
    const newAmPm = ampm === "AM" ? "PM" : "AM";
    setAmPm(newAmPm);
    handleTimeChange(hour, minute, newAmPm);
  };

  return (
    <div className="spinner-timepicker">
      {/* Hours */}
      <div className="spinner-column">
        <button className="arrow-btn" onClick={incrementHour}>▲</button>
        <div className="spinner-value">{pad(hour)}</div>
        <button className="arrow-btn" onClick={decrementHour}>▼</button>
      </div>

      <div className="spinner-col-separator">:</div>

      {/* Minutes */}
      <div className="spinner-column">
        <button className="arrow-btn" onClick={incrementMinute}>▲</button>
        <div className="spinner-value">{pad(minute)}</div>
        <button className="arrow-btn" onClick={decrementMinute}>▼</button>
      </div>

      {/* AM/PM */}
      <div className="spinner-column">
        <button className="arrow-btn" onClick={toggleAmPm}>▲</button>
        <div className="spinner-value">{ampm}</div>
        <button className="arrow-btn" onClick={toggleAmPm}>▼</button>
      </div>
    </div>
  );
}
