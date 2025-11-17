import React, { useState, useRef, useEffect } from "react";
import "./TimePickerWheel.css";

export default function TimePickerWheel({ value, onChange }) {
  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"));
  const meridiem = ["AM", "PM"];

  const hourRef = useRef(null);
  const minuteRef = useRef(null);
  const meridiemRef = useRef(null);

  // helper
  const snapToMiddle = (ref, list, key) => {
    if (!ref.current) return;

    const itemHeight = 48; // must match CSS
    const scrollTop = ref.current.scrollTop;
    const index = Math.round(scrollTop / itemHeight);

    const newValue = list[index];

    onChange({
      ...value,
      [key]: newValue,
    });

    ref.current.scrollTo({
      top: index * itemHeight,
      behavior: "smooth",
    });
  };

  return (
    <div className="tpw-wrapper">
      <div className="tpw-highlight" />

      {/* HOURS */}
      <div
        className="tpw-column"
        ref={hourRef}
        onScroll={() => snapToMiddle(hourRef, hours, "hour")}
      >
        {hours.map((h, i) => (
          <div key={i} className="tpw-item">
            {h}
          </div>
        ))}
      </div>

      {/* MINUTES */}
      <div
        className="tpw-column"
        ref={minuteRef}
        onScroll={() => snapToMiddle(minuteRef, minutes, "minute")}
      >
        {minutes.map((m, i) => (
          <div key={i} className="tpw-item">
            {m}
          </div>
        ))}
      </div>

      {/* AM/PM */}
      <div
        className="tpw-column"
        ref={meridiemRef}
        onScroll={() => snapToMiddle(meridiemRef, meridiem, "ampm")}
      >
        {meridiem.map((ap, i) => (
          <div key={i} className="tpw-item">
            {ap}
          </div>
        ))}
      </div>
    </div>
  );
}
