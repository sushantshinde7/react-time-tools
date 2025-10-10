import React, { useState, useEffect } from "react";
import AnalogClock from "./AnalogClock";
import "./Clock.css";

const parseGMTOffset = (gmt) => {
  const match = gmt.match(/GMT([+-]?\d+(?:\.\d+)?)/);
  return match ? parseFloat(match[1]) : 0;
};

const CityClock = ({ city, editMode, onRemove }) => {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const offset = parseGMTOffset(city.gmt);
      const now = new Date();
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const cityDate = new Date(utc + offset * 3600000);
      const hours = cityDate.getHours();
      const minutes = cityDate.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";
      const displayHours = hours % 12 === 0 ? 12 : hours % 12;
      setTime(
        `${displayHours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")} ${ampm}`
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [city.gmt]);

  // remove handler wrapper to stop propagation (prevents DnD click interference)
  const handleRemoveClick = (e) => {
    e.stopPropagation();
    // optional: e.preventDefault();
    onRemove(city.name);
  };

  return (
    <div className="city-item" onMouseDown={(e) => e.stopPropagation()}>
      <AnalogClock gmt={city.gmt} />
      <div className="city-info">
        <div className="city-name">{city.name}</div>
        <small>({city.gmt})</small>
      </div>

      <div className="city-time">{time}</div>

      {editMode && (
        <button
          type="button"
          className="remove-btn"
          onClick={handleRemoveClick}
          onMouseDown={(e) => e.stopPropagation()} // prevent starting a drag on mousedown
          aria-label={`Remove ${city.name}`}
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default CityClock;
