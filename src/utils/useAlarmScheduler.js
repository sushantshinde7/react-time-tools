// src/utils/useAlarmScheduler.js

import { useEffect } from "react";

export default function useAlarmScheduler(alarms, setAlarms, setRingingAlarm, audioRef) {

  useEffect(() => {
    const checkAlarm = () => {
      const now = new Date();
      const h = now.getHours();
      const m = now.getMinutes();
      const nowKey = `${h}:${m}`;

      setAlarms((prev) =>
        prev.map((alarm) => {
          if (!alarm.isOn) return alarm;

          // avoid duplicate
          if (alarm.lastTriggered === nowKey) return alarm;

          // convert alarm time
          const [time, ampm] = alarm.time.split(" ");
          let [ah, am] = time.split(":").map(Number);

          if (ampm === "PM" && ah !== 12) ah += 12;
          if (ampm === "AM" && ah === 12) ah = 0;

          // match
          if (ah === h && am === m) {
            // custom repeat check
            if (alarm.repeatMode === "custom") {
              const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
              const today = days[now.getDay()];
              if (!alarm.repeatDays.includes(today)) return alarm;
            }

            // start ringing
            setRingingAlarm(alarm);

            // PLAY sound looping
            if (audioRef.current) {
              audioRef.current.pause();
            }
            audioRef.current = new Audio(
              alarm.ringtone
                ? `/src/sounds/${alarm.ringtone}.mp3`
                : "/src/sounds/airtel.mp3"
            );
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

  }, [alarms]); // <--- triggers when alarms list updates
}
