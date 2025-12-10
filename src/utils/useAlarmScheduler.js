import { useEffect, useRef } from "react";

/**
 * Scheduler behaviour summary:
 * - Always group ALL active alarms by minute (snoozed + normal).
 * - Remove expired snooze instances.
 * - Snoozed alarms for this minute have priority.
 * - Only one alarm rings at a time.
 * - Auto-dismiss after timeout.
 * - Progressive volume fade-in.
 */
export default function useAlarmScheduler(
  alarms,
  setAlarms,
  ringingAlarm,
  setRingingAlarm,
  audioRef,
  audioBank
) {
  const fadeIntervalRef = useRef(null);
  const startedAtRef = useRef(null);

  useEffect(() => {
    const checkAlarm = () => {
      // ---------- Auto-dismiss ----------
      if (ringingAlarm) {
        const started = ringingAlarm.startedAt || Date.now();
        const elapsed = Date.now() - started;
        const AUTO_LIMIT = 3 * 60 * 1000;

        if (elapsed >= AUTO_LIMIT) {
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
          }

          const id = ringingAlarm.id;
          setRingingAlarm(null);
          startedAtRef.current = null; // Clear ref on stop

          // ---------- Cleanup alarm ----------
          setAlarms((prev) =>
            prev
              .map((a) => {
                if (a.id !== id) return a;

                if (a.isSnoozeInstance) return null;

                const dayMap = [
                  "Sun",
                  "Mon",
                  "Tue",
                  "Wed",
                  "Thu",
                  "Fri",
                  "Sat",
                ];
                const today = dayMap[new Date().getDay()];

                const noDays =
                  a.repeatMode === "custom" &&
                  (!a.repeatDays || a.repeatDays.length === 0);

                if (a.repeatMode === "once" || noDays) {
                  return { ...a, isOn: false, queuePending: false };
                }

                if (a.repeatMode === "custom" && a.repeatDays.includes(today)) {
                  const updatedDays = a.repeatDays.filter((d) => d !== today);
                  return {
                    ...a,
                    repeatDays: updatedDays,
                    isOn: updatedDays.length > 0,
                    queuePending: false,
                  };
                }

                return { ...a, queuePending: false };
              })
              .filter(Boolean)
          );

          return;
        }
      }

      // ---------- Build grouped map ----------
      const now = new Date();
      const nowKey = `${now.getHours()}:${now.getMinutes()}`;

      const active = alarms.filter((a) => a.isOn);

      // Remove expired snoozes
      const cleanedActive = active.filter((a) => {
        if (!a.isSnoozeInstance) return true;

        const [time, ampm] = a.time.split(" ");
        let [hh, mm] = time.split(":").map(Number);
        if (ampm === "PM" && hh !== 12) hh += 12;
        if (ampm === "AM" && hh === 12) hh = 0;

        const alarmMinutes = hh * 60 + mm;
        const nowMinutes = now.getHours() * 60 + now.getMinutes();
        return alarmMinutes >= nowMinutes;
      });

      // Convert custom with NO days → once
      const normalizedActive = cleanedActive.map((a) => {
        if (
          a.repeatMode === "custom" &&
          (!a.repeatDays || a.repeatDays.length === 0)
        ) {
          return { ...a, repeatMode: "once" };
        }
        return a;
      });

      // Filter by today
      const dayMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const today = dayMap[now.getDay()];

      const validForToday = normalizedActive.filter((a) => {
        if (a.isSnoozeInstance) return true;
        if (a.repeatMode !== "custom") return true;
        return a.repeatDays.includes(today);
      });

      // Group alarms by hh:mm
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

      if (ringingAlarm) return;

      const alreadyTriggered = queueThisMinute.filter(
        (a) => a.lastTriggered === nowKey
      );
      if (alreadyTriggered.length > 0) return;

      if (queueThisMinute.length === 0) return;

      // Snooze priority
      const snoozedThisMinute = queueThisMinute.filter(
        (a) => a.isSnoozeInstance
      );
      const ringQueue =
        snoozedThisMinute.length > 0 ? snoozedThisMinute : queueThisMinute;

      const first = ringQueue[0];
      if (!first) return;

      // ---------- START RINGING ----------
      const startedAt = Date.now();
      startedAtRef.current = startedAt;

      setRingingAlarm({ ...first, startedAt });
      first.startedAt = startedAt;

      if (audioRef.current) audioRef.current.pause();
      const sound =
        audioBank.current[first.ringtone] || audioBank.current["airtel"];
      audioRef.current = sound;

      try {
        audioRef.current.currentTime = 0;
      } catch {}

      audioRef.current.loop = true;
      audioRef.current.volume = 0.2;
      audioRef.current.play().catch(() => {});

      // Clear old fade interval
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
        fadeIntervalRef.current = null;
      }

      // ---------- Progressive Fade-In ----------
      fadeIntervalRef.current = setInterval(() => {
        if (!audioRef.current) {
          clearInterval(fadeIntervalRef.current);
          fadeIntervalRef.current = null;
          return;
        }

        const elapsed = Date.now() - (startedAtRef.current ?? Date.now());

        if (elapsed >= 30000) {
          audioRef.current.volume = 1.0;
          clearInterval(fadeIntervalRef.current);
          fadeIntervalRef.current = null;
          return;
        } else if (elapsed >= 20000) audioRef.current.volume = 0.6;
        else if (elapsed >= 10000) audioRef.current.volume = 0.4;
        else audioRef.current.volume = 0.2;
      }, 1000);

      // ---------- Mark triggered ----------
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

    return () => {
      clearInterval(interval);
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
        fadeIntervalRef.current = null;
      }
    };
  }, [alarms, ringingAlarm]);
}
