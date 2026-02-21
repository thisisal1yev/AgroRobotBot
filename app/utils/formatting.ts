export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function severityColor(severity: string) {
  if (severity === "CRITICAL" || severity === "HIGH") return "error";
  if (severity === "MEDIUM") return "warning";
  return "info";
}

export function robotStatusColor(status: string) {
  if (status === "ONLINE") return "success";
  if (status === "IN_MISSION") return "warning";
  if (status === "CHARGING") return "info";
  return "neutral";
}

export function seasonStatusColor(status: string) {
  if (status === "ACTIVE") return "success";
  if (status === "PLANNED") return "info";
  return "neutral";
}

export function pluralize(count: number, singular: string) {
  return `${count} ${singular}${count !== 1 ? "s" : ""}`;
}
