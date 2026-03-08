"use client"
import { useEffect, useState } from "react"
import { Modal } from "@/components/ui/modal"
import { Badge } from "@/components/ui/badge"
import { fmtDate } from "@/lib/format"
import { getChange } from "@/lib/api"
import { SeverityPill } from "./severity-pill"

export function ChangeDrawer({ id, open, onClose }: { id: string | null; open: boolean; onClose: () => void }) {
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open || !id) return
    setData(null)
    setError(null)
    getChange(id).then(setData).catch((e) => setError(e?.message ?? String(e)))
  }, [open, id])

  return (
    <Modal open={open} title="Change details" onClose={onClose} className="max-w-2xl">
      <div className="p-4 space-y-3">
        {error ? <div className="text-sm text-danger">{error}</div> : null}
        {!data ? (
          <div className="text-sm text-mutedForeground">Loading...</div>
        ) : (
          <>
            <div className="flex items-center justify-between gap-2">
              <div className="text-sm font-semibold">{data?.page?.url ?? "—"}</div>
              <SeverityPill v={data?.severity} />
            </div>
            <div className="text-xs text-mutedForeground">
              {data.changeType} • detected {fmtDate(data.detectedAt)}
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl border p-3 bg-background/15">
                <div className="text-xs text-mutedForeground mb-1">From snapshot</div>
                <div className="text-xs">{data.fromSnapshotId ?? "—"}</div>
              </div>
              <div className="rounded-2xl border p-3 bg-background/15">
                <div className="text-xs text-mutedForeground mb-1">To snapshot</div>
                <div className="text-xs">{data.toSnapshotId}</div>
              </div>
            </div>

            <div className="rounded-2xl border p-3 bg-background/15">
              <div className="text-xs text-mutedForeground mb-1">Summary</div>
              <div className="text-sm">{data.summary}</div>
            </div>

            <div className="rounded-2xl border p-3 bg-background/15">
              <div className="text-xs text-mutedForeground mb-1">Diff stats</div>
              <pre className="text-xs overflow-auto">{JSON.stringify(data.diffJson ?? {}, null, 2)}</pre>
            </div>

            <div className="text-xs text-mutedForeground">
              Next step: add screenshot diff & text diff viewer. Сейчас это уже “production skeleton”.
            </div>
          </>
        )}
      </div>
    </Modal>
  )
}
