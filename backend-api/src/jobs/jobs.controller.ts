import { Controller, Post } from "@nestjs/common"
import { JobsService } from "./jobs.service"

@Controller("api/jobs")
export class JobsController {
  constructor(private svc: JobsService) {}

  @Post("tick")
  tick() {
    return this.svc.tick()
  }
}
