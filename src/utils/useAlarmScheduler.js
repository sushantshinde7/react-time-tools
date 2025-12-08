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

      // ACTIVE alarms only
      const active = alarms.filter((a) => a.isOn);

      // ---- NEW FIX ----
      // Separate snoozed + normal alarms
      const snoozed = active.filter((a) => a.isSnoozeInstance);
      const normal = active.filter((a) => !a.isSnoozeInstance);

      // Build ONE list but prioritize snoozed ONLY for matching minute
      const toCheck = [...snoozed, ...normal];

      // Group by minute
      const grouped = {};
      toCheck.forEach((a) => {
        const [time, ampm] = a.time.split(" ");
        let [hh, mm] = time.split(":").map(Number);

        if (ampm === "PM" && hh !== 12) hh += 12;
        if (ampm === "AM" && hh === 12) hh = 0;

        const key = `${hh}:${mm}`;
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(a);
      });

      // Sort by createdAt consistently
      Object.keys(grouped).forEach((k) => {
        grouped[k].sort((a, b) => a.createdAt - b.createdAt);
      });

      const queueThisMinute = grouped[nowKey] || [];

      // Already ringing? Stop here
      if (ringingAlarm) return;

      // Nothing to ring this minute
      if (queueThisMinute.length === 0) return;

      // PRIORITY FIX:
      // If snoozed alarms exist for this minute, use them first
      const snoozedThisMinute = queueThisMinute.filter((a) => a.isSnoozeInstance);
      const ringQueue =
        snoozedThisMinute.length > 0 ? snoozedThisMinute : queueThisMinute;

      // Take first in queue
      const first = ringQueue[0];

      setRingingAlarm(first);

      // Play audio
      if (audioRef.current) audioRef.current.pause();
      audioRef.current = audioBank.current[first.ringtone];
      audioRef.current.currentTime = 0;
      audioRef.current.loop = true;
      audioRef.current.play();

      // Mark queuePending only for those in this minute
      setAlarms((prev) =>
        prev.map((a) => {
          if (ringQueue.some((g) => g.id === a.id)) {
            return {
              ...a,
              lastTriggered: nowKey,
              queuePending: true,
            };
          }
          return a;
        })
      );
    };

    const interval = setInterval(checkAlarm, 1000);
    return () => clearInterval(interval);
  }, [alarms, ringingAlarm]);
}
