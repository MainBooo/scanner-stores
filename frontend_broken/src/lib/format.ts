export function fmtDate(v: string | Date | null | undefined) {
  if (!v) return "—"
  const d = typeof v === "string" ? new Date(v) : v
  return d.toLocaleString()
}
