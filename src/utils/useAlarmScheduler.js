// src/utils/useAlarmScheduler.js
import { useEffect } from "react";

export default function useAlarmScheduler(
  alarms,
  setAlarms,
  ringingAlarm,
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
      let triggered = false;

      // STEP 1: GROUP alarms by their minute
      const grouped = {};
      alarms.forEach((a) => {
        if (!a.isOn) return;

        const [time, ampm] = a.time.split(" ");
        let [hh, mm] = time.split(":").map(Number);

        if (ampm === "PM" && hh !== 12) hh += 12;
        if (ampm === "AM" && hh === 12) hh = 0;

        const k = `${hh}:${mm}`;
        if (!grouped[k]) grouped[k] = [];
        grouped[k].push(a);
      });

      // FIX: sort using id (because alarms have no createdAt)
      Object.keys(grouped).forEach((k) => {
        grouped[k].sort((a, b) => a.id - b.id);
      });

      const minuteGroup = grouped[nowKey] || [];

      // STEP 2: If something already ringing → don't retrigger others
      if (ringingAlarm) {
        return; // Keep only current alarm ringing
      }

      // STEP 3: If minute matches → ring next alarm in queue
      if (minuteGroup.length > 0) {
        const first = minuteGroup[0];

        // prevent double trigger
        if (first.lastTriggered === nowKey) return;

        triggered = true;
        setRingingAlarm(first);

        // play sound
        if (audioRef.current) audioRef.current.pause();
        audioRef.current = audioBank.current[first.ringtone];
        audioRef.current.currentTime = 0;
        audioRef.current.loop = true;
        audioRef.current.play();

        // mark queue pending for this minute
        setAlarms((prev) =>
          prev.map((a) => {
            // fix: use "a", not undefined variable "alarm"
            if (a.id === first.id) {
              return {
                ...a,
                lastTriggered: nowKey,
                queuePending: true,
                isOn: true,
              };
            }

            // other alarms same minute → queue pending
            if (minuteGroup.some((g) => g.id === a.id)) {
              return { ...a, queuePending: true };
            }

            return a;
          })
        );

        return;
      }
    };

    const interval = setInterval(checkAlarm, 1000);
    return () => clearInterval(interval);

  }, [alarms, ringingAlarm]);
}
