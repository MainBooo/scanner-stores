import { z } from "zod"
export const CreateCompetitorSchema = z.object({
  domain: z.string().min(3),
  displayName: z.string().optional(),
})
