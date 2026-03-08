"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("./prisma/prisma.service");
const health_controller_1 = require("./health/health.controller");
const competitors_controller_1 = require("./competitors/competitors.controller");
const competitors_service_1 = require("./competitors/competitors.service");
const pages_controller_1 = require("./pages/pages.controller");
const pages_service_1 = require("./pages/pages.service");
const changes_controller_1 = require("./changes/changes.controller");
const changes_service_1 = require("./changes/changes.service");
const jobs_controller_1 = require("./jobs/jobs.controller");
const jobs_service_1 = require("./jobs/jobs.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule.forRoot({ isGlobal: true })],
        controllers: [health_controller_1.HealthController, competitors_controller_1.CompetitorsController, pages_controller_1.PagesController, changes_controller_1.ChangesController, jobs_controller_1.JobsController],
        providers: [prisma_service_1.PrismaService, competitors_service_1.CompetitorsService, pages_service_1.PagesService, changes_service_1.ChangesService, jobs_service_1.JobsService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map