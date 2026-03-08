import { Badge } from "@/components/ui/badge"

export function SeverityPill({ v }: { v: "low" | "med" | "high" | null | undefined }) {
  if (!v) return <Badge>—</Badge>
  if (v === "high") return <Badge variant="danger">high</Badge>
  if (v === "med") return <Badge variant="warning">med</Badge>
  return <Badge variant="secondary">low</Badge>
}
