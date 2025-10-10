import React, { useEffect, useState } from "react";
import "./AnalogClock.css";

const parseGMTOffset = (gmt) => {
  const match = gmt.match(/GMT([+-]?\d+(?:\.\d+)?)/);
  return match ? parseFloat(match[1]) : 0;
};

const AnalogClock = ({ gmt }) => {
  const [time, setTime] = useState(() => getCityTime(gmt));

  function getCityTime(gmt) {
    const offset = parseGMTOffset(gmt);
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const cityDate = new Date(utc + offset * 3600000);
    return {
      hours: cityDate.getHours(),
      minutes: cityDate.getMinutes(),
      seconds: cityDate.getSeconds(),
      ms: cityDate.getMilliseconds(),
    };
  }

  useEffect(() => {
    let frame;
    const update = () => {
      setTime(getCityTime(gmt));
      frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, [gmt]);

  const hourDeg = (time.hours % 12) * 30 + time.minutes * 0.5;
  const minuteDeg = time.minutes * 6 + time.seconds * 0.1;
  const secondDeg = time.seconds * 6 + (time.ms / 1000) * 6;

  const isDay = time.hours >= 6 && time.hours < 18;

  return (
    <div className={`analog-clock ${isDay ? "day" : "night"}`}>
      <div className="hand hour-hand" style={{ transform: `rotate(${hourDeg}deg)` }} />
      <div className="hand minute-hand" style={{ transform: `rotate(${minuteDeg}deg)` }} />
      <div className="second-dot" style={{ transform: `rotate(${secondDeg}deg)` }} />
    </div>
  );
};

export default AnalogClock;

