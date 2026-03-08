import { Body, Controller, Get, Param, Post } from "@nestjs/common"
import { CompetitorsService } from "./competitors.service"
import { CreateCompetitorSchema } from "./competitors.dto"
import { ZodPipe } from "../common/zod.pipe"

@Controller("api/competitors")
export class CompetitorsController {
  constructor(private svc: CompetitorsService) {}

  @Get()
  list() {
    return this.svc.list()
  }

  @Post()
  create(@Body(new ZodPipe(CreateCompetitorSchema)) body: any) {
    return this.svc.create(body.domain, body.displayName)
  }

  @Get(":id/suggestions")
  suggestions(@Param("id") id: string) {
    return this.svc.suggestions(id)
  }
}
