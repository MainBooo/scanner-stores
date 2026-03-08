"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompetitorsController = void 0;
const common_1 = require("@nestjs/common");
const competitors_service_1 = require("./competitors.service");
const competitors_dto_1 = require("./competitors.dto");
const zod_pipe_1 = require("../common/zod.pipe");
let CompetitorsController = class CompetitorsController {
    constructor(svc) {
        this.svc = svc;
    }
    list() {
        return this.svc.list();
    }
    create(body) {
        return this.svc.create(body.domain, body.displayName);
    }
    suggestions(id) {
        return this.svc.suggestions(id);
    }
};
exports.CompetitorsController = CompetitorsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CompetitorsController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)(new zod_pipe_1.ZodPipe(competitors_dto_1.CreateCompetitorSchema))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CompetitorsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(":id/suggestions"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CompetitorsController.prototype, "suggestions", null);
exports.CompetitorsController = CompetitorsController = __decorate([
    (0, common_1.Controller)("api/competitors"),
    __metadata("design:paramtypes", [competitors_service_1.CompetitorsService])
], CompetitorsController);
//# sourceMappingURL=competitors.controller.js.map