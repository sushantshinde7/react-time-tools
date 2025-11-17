import React, { useEffect, useRef } from "react";
import "./TimePickerWheel.css";

export default function TimePickerWheel({ value, onChange }) {
  const baseHours = Array.from({ length: 12 }, (_, i) => i + 1);
  const baseMinutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0")
  );
  const baseMeridiem = ["AM", "PM"];

  // how many repetitions — enough to feel infinite but not too heavy
  const REPEAT = 20;

  const hours = buildRepeated(baseHours, REPEAT);
  const minutes = buildRepeated(baseMinutes, REPEAT);
  const meridiem = buildRepeated(baseMeridiem, REPEAT);

  const hourRef = useRef(null);
  const minuteRef = useRef(null);
  const meridiemRef = useRef(null);
  const scrollTimeout = useRef({});

  const ITEM_HEIGHT = 48; // must match CSS .tpw-item height

  // Build repeated flat array
  function buildRepeated(list, times) {
    const out = new Array(list.length * times);
    for (let i = 0; i < times; i++) {
      for (let j = 0; j < list.length; j++) {
        out[i * list.length + j] = list[j];
      }
    }
    return out;
  }

  // Map a long-array index to base array value
  function mapIndexToValue(index, baseList) {
    const len = baseList.length;
    // positive modulo
    const mod = ((index % len) + len) % len;
    return baseList[mod];
  }

  // Snap handler: given ref and its base list, snap to nearest item and notify parent
  function snapToMiddle(ref, baseList, onKey) {
    if (!ref.current) return;
    const scrollTop = ref.current.scrollTop;
    const index = Math.round(scrollTop / ITEM_HEIGHT);

    // get real value using modulo
    const realValue = mapIndexToValue(index, baseList);

    // report to parent
    onChange({
      ...value,
      [onKey]: realValue,
    });

    // smoothly re-center to exact item position
    ref.current.scrollTo({
      top: index * ITEM_HEIGHT,
      behavior: "auto",
    });
  }

  // When component mounts, center each column on the repeated block that contains current value
  useEffect(() => {
    // helper to compute start index
    const centerBlock = Math.floor(REPEAT / 2) * baseHours.length;

    // compute index for hour
    const hourIndexInBase =
      baseHours.indexOf(Number(value.hour)) !== -1
        ? baseHours.indexOf(Number(value.hour))
        : 0;
    const minuteIndexInBase =
      baseMinutes.indexOf(String(value.minute).padStart(2, "0")) !== -1
        ? baseMinutes.indexOf(String(value.minute).padStart(2, "0"))
        : 0;
    const merIndexInBase =
      baseMeridiem.indexOf(value.ampm) !== -1
        ? baseMeridiem.indexOf(value.ampm)
        : 0;

    // scroll to middle repetition + base index (plus one spacer already in DOM)
    if (hourRef.current) {
      hourRef.current.scrollTop = (centerBlock + hourIndexInBase) * ITEM_HEIGHT;
    }
    if (minuteRef.current) {
      // for minutes centerBlock must use baseMinutes length
      const centerBlockMin = Math.floor(REPEAT / 2) * baseMinutes.length;
      minuteRef.current.scrollTop =
        (centerBlockMin + minuteIndexInBase) * ITEM_HEIGHT;
    }
    if (meridiemRef.current) {
      const centerBlockMer = Math.floor(REPEAT / 2) * baseMeridiem.length;
      meridiemRef.current.scrollTop =
        (centerBlockMer + merIndexInBase) * ITEM_HEIGHT;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  // Small throttle: only trigger snap after user stops scrolling.
  // We'll use onScroll with a debounce via requestAnimationFrame and setTimeout.
  // Keep one timer per column:
  const timers = useRef({ h: null, m: null, p: null });
  const slowScroll = (ref) => {
  if (!ref.current) return;

  ref.current.style.scrollBehavior = "auto"; // free scroll
  clearTimeout(ref.current.snapTimeout);

  ref.current.snapTimeout = setTimeout(() => {
    ref.current.style.scrollBehavior = "smooth"; // smooth snap
  }, 150);
};

  const handleScroll = (ref, list, key) => {
    if (!ref.current) return;

    clearTimeout(scrollTimeout.current[key]);

    scrollTimeout.current[key] = setTimeout(() => {
      snapToMiddle(ref, list, key);
    }, 120); // slow down snapping
  };

  return (
  <div className="tpw-wrapper">
    <div className="tpw-highlight" />

    {/* HOURS */}
    <div
      className="tpw-column"
      ref={hourRef}
      onScroll={() => {
        slowScroll(hourRef);
        handleScroll(hourRef, hours, "hour");
      }}
    >
      <div className="tpw-spacer" />
      {hours.map((h, i) => (
        <div key={`h-${i}`} className="tpw-item">
          {h}
        </div>
      ))}
      <div className="tpw-spacer" />
    </div>

    {/* MINUTES */}
    <div
      className="tpw-column"
      ref={minuteRef}
      onScroll={() => {
        slowScroll(minuteRef);
        handleScroll(minuteRef, minutes, "minute");
      }}
    >
      <div className="tpw-spacer" />
      {minutes.map((m, i) => (
        <div key={`m-${i}`} className="tpw-item">
          {m}
        </div>
      ))}
      <div className="tpw-spacer" />
    </div>

    {/* AM/PM */}
    <div
      className="tpw-column"
      ref={meridiemRef}
      onScroll={() => {
        slowScroll(meridiemRef);
        handleScroll(meridiemRef, meridiem, "ampm");
      }}
    >
      <div className="tpw-spacer" />
      {meridiem.map((ap, i) => (
        <div key={`p-${i}`} className="tpw-item">
          {ap}
        </div>
      ))}
      <div className="tpw-spacer" />
    </div>
  </div>
);

}
