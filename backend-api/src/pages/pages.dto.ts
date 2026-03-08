import { z } from "zod"
export const BulkEnableSchema = z.object({
  competitorId: z.string().uuid(),
  urls: z.array(z.string().min(1)).min(1),
  intervalMin: z.number().int().min(5).max(1440),
})
