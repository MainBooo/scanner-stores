import { AppShell } from "@/components/shell/app-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function InsightsPage() {
  return (
    <AppShell activeHref="/insights" title="Insights">
      <Card>
        <CardHeader>
          <CardTitle>Insights</CardTitle>
          <Badge>AI next</Badge>
        </CardHeader>
        <CardContent className="text-sm text-mutedForeground space-y-2">
          <div>• (MVP) Здесь будет AI анализ изменений и weekly report.</div>
          <div>• Следующий шаг v4: отправляем changes в LLM и строим “what happened”.</div>
        </CardContent>
      </Card>
    </AppShell>
  )
}
