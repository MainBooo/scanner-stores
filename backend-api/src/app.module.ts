import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { PrismaService } from "./prisma/prisma.service"
import { HealthController } from "./health/health.controller"
import { CompetitorsController } from "./competitors/competitors.controller"
import { CompetitorsService } from "./competitors/competitors.service"
import { PagesController } from "./pages/pages.controller"
import { PagesService } from "./pages/pages.service"
import { ChangesController } from "./changes/changes.controller"
import { ChangesService } from "./changes/changes.service"
import { JobsController } from "./jobs/jobs.controller"
import { JobsService } from "./jobs/jobs.service"

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [HealthController, CompetitorsController, PagesController, ChangesController, JobsController],
  providers: [PrismaService, CompetitorsService, PagesService, ChangesService, JobsService],
})
export class AppModule {}
