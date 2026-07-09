export function normalizeId(id) {
  if (!id) return "";
  if (typeof id === "object" && id._id) return String(id._id);
  return String(id);
}

export function formatMessageTime(date) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}