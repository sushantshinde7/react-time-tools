export function formatRepeatText(repeatDays = []) {
  if (!Array.isArray(repeatDays) || repeatDays.length === 0) {
    return "Once";
  }

  if (repeatDays.length === 7) return "Everyday";

  return repeatDays.join(" ");
}
