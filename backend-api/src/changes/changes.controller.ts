import { Controller, Get, Param, Query, NotFoundException } from "@nestjs/common"
import { ChangesService } from "./changes.service"

@Controller("api/changes")
export class ChangesController {
  constructor(private svc: ChangesService) {}

  @Get()
  list(@Query("severity") severity?: string) {
    return this.svc.list(severity)
  }

  @Get(":id")
  async get(@Param("id") id: string) {
    const x = await this.svc.get(id)
    if (!x) throw new NotFoundException("not found")
    return x
  }
}
