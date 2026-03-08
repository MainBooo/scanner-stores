import { AppShell } from "@/components/shell/app-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function SettingsPage() {
  return (
    <AppShell activeHref="/settings" title="Settings">
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <Badge>v3</Badge>
        </CardHeader>
        <CardContent className="text-sm text-mutedForeground">
          Здесь появятся alerts, интеграции, тарифы, команда.
        </CardContent>
      </Card>
    </AppShell>
  )
}
