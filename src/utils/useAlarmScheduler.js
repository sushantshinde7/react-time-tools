// src/utils/useAlarmScheduler.js
import { useEffect } from "react";

/**
 * Scheduler behaviour summary:
 * - Always group ALL active alarms by minute (snoozed + normal).
 * - Remove expired snooze instances (time < now) so they don't block.
 * - If there are snoozed alarms for THIS minute, they get priority for this minute.
 * - Otherwise normal alarms for this minute can ring.
 * - Only one alarm rings at a time (ringingAlarm guards this).
 * - When an alarm starts ringing, set startedAt so auto-dismiss works.
 * - Auto-dismiss stops and cleans up only the currently ringing alarm.
 */
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
      // ---------- Auto-dismiss (light and safe) ----------
      if (ringingAlarm) {
        const started = ringingAlarm.startedAt || Date.now();
        const elapsed = Date.now() - started;
        const AUTO_LIMIT = 3 * 60 * 1000; // 3 minutes

        if (elapsed >= AUTO_LIMIT) {
          // stop audio
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
          }

          const id = ringingAlarm.id;

          // clear ringing state and clean only that alarm (non-destructive)
          setRingingAlarm(null);

          setAlarms((prev) =>
            prev
              .map((a) => {
                if (a.id !== id) return a;

                // remove snooze instance
                if (a.isSnoozeInstance) return null;

                // --- FIX 2: once OR custom → turn OFF on stop ---
                // if once OR custom with no days -> turn off
                const noDays =
                  a.repeatMode === "custom" &&
                  (!a.repeatDays || a.repeatDays.length === 0);

                if (a.repeatMode === "once" || noDays) {
                  return { ...a, isOn: false, queuePending: false };
                }

                // if custom WITH days and today is included -> remove TODAY from repeatDays
                if (a.repeatMode === "custom" && a.repeatDays.includes(today)) {
                  const updatedDays = a.repeatDays.filter((d) => d !== today);

                  return {
                    ...a,
                    repeatDays: updatedDays,
                    isOn: updatedDays.length > 0, // turn ON only if days remain
                    queuePending: false,
                  };
                }

                // daily/weekdays/weekends behave normally:
                return { ...a, queuePending: false };

                // repeating -> keep on, clear queuePending
                return { ...a, queuePending: false };
              })
              .filter(Boolean)
          );

          // stop early — don't run full scheduling logic this tick
          return;
        }
      }

      // ---------- Build grouped map of active alarms ----------
      const now = new Date();
      const nowH = now.getHours();
      const nowM = now.getMinutes();
      const nowKey = `${nowH}:${nowM}`;

      // active alarms only
      const active = alarms.filter((a) => a.isOn);

      // remove expired snooze instances (their minute already passed)
      const cleanedActive = active.filter((a) => {
        if (!a.isSnoozeInstance) return true;

        const [time, ampm] = a.time.split(" ");
        let [hh, mm] = time.split(":").map(Number);
        if (ampm === "PM" && hh !== 12) hh += 12;
        if (ampm === "AM" && hh === 12) hh = 0;

        const alarmMinutes = hh * 60 + mm;
        const nowMinutes = now.getHours() * 60 + now.getMinutes();

        if (alarmMinutes < nowMinutes) return false;
        return true;
      });

      // ---------- FIX 1 — Convert custom with NO days → once ----------
      const normalizedActive = cleanedActive.map((a) => {
        if (
          a.repeatMode === "custom" &&
          (!a.repeatDays || a.repeatDays.length === 0)
        ) {
          return { ...a, repeatMode: "once" };
        }
        return a;
      });

      // ---------- FILTER BY TODAY for custom repeat alarms ----------
      const dayMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const today = dayMap[new Date().getDay()];

      const validForToday = normalizedActive.filter((a) => {
        if (a.isSnoozeInstance) return true;
        if (a.repeatMode !== "custom") return true;
        return a.repeatDays?.includes(today);
      });

      // ---------- GROUP ONLY validToday alarms ----------
      const grouped = {};
      validForToday.forEach((a) => {
        const [time, ampm] = a.time.split(" ");
        let [hh, mm] = time.split(":").map(Number);

        if (ampm === "PM" && hh !== 12) hh += 12;
        if (ampm === "AM" && hh === 12) hh = 0;

        const key = `${hh}:${mm}`;
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(a);
      });

      // stable sort
      Object.keys(grouped).forEach((k) => {
        grouped[k].sort((a, b) => {
          const ca = a.createdAt ?? a.id;
          const cb = b.createdAt ?? b.id;
          if (ca < cb) return -1;
          if (ca > cb) return 1;
          return a.id - b.id;
        });
      });

      const queueThisMinute = (grouped[nowKey] || []).filter((a) =>
        validForToday.includes(a)
      );

      // already ringing? do nothing
      if (ringingAlarm) return;

      // avoid re-triggering in same minute
      const alreadyTriggeredThisMinute = queueThisMinute.filter(
        (a) => a.lastTriggered === nowKey
      );
      if (alreadyTriggeredThisMinute.length > 0) return;

      if (queueThisMinute.length === 0) return;

      // snooze priority
      const snoozedThisMinute = queueThisMinute.filter(
        (a) => a.isSnoozeInstance
      );
      const ringQueue =
        snoozedThisMinute.length > 0 ? snoozedThisMinute : queueThisMinute;

      const first = ringQueue[0];
      if (!first) return;

      // set ringing state
      setRingingAlarm({ ...first, startedAt: Date.now() });

      // play audio
      if (audioRef.current) audioRef.current.pause();
      const sound =
        audioBank.current[first.ringtone] || audioBank.current["airtel"];
      audioRef.current = sound;
      try {
        audioRef.current.currentTime = 0;
      } catch (e) {}
      audioRef.current.loop = true;
      audioRef.current.play().catch(() => {});

      // mark triggered
      setAlarms((prev) =>
        prev.map((a) => {
          if (ringQueue.some((g) => g.id === a.id)) {
            return { ...a, lastTriggered: nowKey, queuePending: true };
          }
          return a;
        })
      );
    };

    const interval = setInterval(checkAlarm, 1000);
    return () => clearInterval(interval);
  }, [alarms, ringingAlarm]);
}
