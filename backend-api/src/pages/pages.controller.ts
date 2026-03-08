import { Body, Controller, Get, Post, Query } from "@nestjs/common"
import { PagesService } from "./pages.service"
import { BulkEnableSchema } from "./pages.dto"
import { ZodPipe } from "../common/zod.pipe"

@Controller("api/pages")
export class PagesController {
  constructor(private svc: PagesService) {}

  @Post("bulk-enable")
  bulkEnable(@Body(new ZodPipe(BulkEnableSchema)) body: any) {
    return this.svc.bulkEnable(body.competitorId, body.urls, body.intervalMin)
  }

  @Get()
  list(@Query("competitorId") competitorId?: string) {
    return this.svc.list(competitorId)
  }
}
