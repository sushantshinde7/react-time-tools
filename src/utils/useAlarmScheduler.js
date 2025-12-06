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

      setAlarms((prev) =>
        prev.map((alarm) => {
          if (!alarm.isOn) return alarm;

          // Prevent double trigger
          if (alarm.lastTriggered === nowKey) return alarm;

          // Convert alarm time → 24hr
          const [time, ampm] = alarm.time.split(" ");
          let [ah, am] = time.split(":").map(Number);

          if (ampm === "PM" && ah !== 12) ah += 12;
          if (ampm === "AM" && ah === 12) ah = 0;

          // Check time match
          if (ah === h && am === m) {
            // Custom repeat check
            if (alarm.repeatMode === "custom") {
              const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
              const today = days[now.getDay()];
              if (!alarm.repeatDays.includes(today)) return alarm;
            }

            // --- START RINGING ---
            setRingingAlarm(alarm);

            // stop old audio
            if (audioRef.current) {
              audioRef.current.pause();
            }

            // Pick ringtone from preloaded bank
            const selected =
              audioBank.current[alarm.ringtone] ||
              audioBank.current["airtel"]; // fallback

            // Assign + play
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

    const interval = setInterval(checkAlarm, 2000);
    return () => clearInterval(interval);
  }, [alarms, audioBank]); // rerun only when alarms change
}

