// src/utils/useAlarmScheduler.js
import { useEffect } from "react";

export default function useAlarmScheduler(
  alarms,
  setAlarms,
  setRingingAlarm,
  audioRef,
  audioBank
) {
  useEffect(() => {
    const checkAlarm = () => {
      const now = new Date();
      const h = now.getHours();
      const m = now.getMinutes();
      const nowKey = `${h}:${m}`;

      let triggered = false; // <= to break early

      setAlarms((prev) =>
        prev.map((alarm) => {
          if (triggered) return alarm; // <= skip rest after 1 match
          if (!alarm.isOn) return alarm;

          // Prevent double trigger
          if (alarm.lastTriggered === nowKey) return alarm;

          // Convert alarm time → 24hr
          const [time, ampm] = alarm.time.split(" ");
          let [ah, am] = time.split(":").map(Number);

          if (ampm === "PM" && ah !== 12) ah += 12;
          if (ampm === "AM" && ah === 12) ah = 0;

          // Time match
          if (ah === h && am === m) {
            // Custom repeat check
            if (alarm.repeatMode === "custom") {
              const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
              const today = days[now.getDay()];
              if (!alarm.repeatDays.includes(today)) return alarm;
            }

            // --- START RINGING ---
            triggered = true;
            setRingingAlarm(alarm);

            if (audioRef.current) audioRef.current.pause();

            const selected =
              audioBank.current[alarm.ringtone] ||
              audioBank.current["airtel"];

            audioRef.current = selected;
            audioRef.current.currentTime = 0;
            audioRef.current.loop = true;
            audioRef.current.play();

            return {
              ...alarm,
              lastTriggered: nowKey,
              isOn: alarm.repeatMode === "once" ? false : true,
            };
          }

          return alarm;
        })
      );
    };

    // 🔹 Updated from 2000 → 1000 (1 sec)
    const interval = setInterval(checkAlarm, 1000);
    return () => clearInterval(interval);
  }, [alarms, audioBank]); // rerun only when alarms change
}
