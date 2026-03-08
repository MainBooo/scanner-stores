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
exports.PagesController = void 0;
const common_1 = require("@nestjs/common");
const pages_service_1 = require("./pages.service");
const pages_dto_1 = require("./pages.dto");
const zod_pipe_1 = require("../common/zod.pipe");
let PagesController = class PagesController {
    constructor(svc) {
        this.svc = svc;
    }
    bulkEnable(body) {
        return this.svc.bulkEnable(body.competitorId, body.urls, body.intervalMin);
    }
    list(competitorId) {
        return this.svc.list(competitorId);
    }
};
exports.PagesController = PagesController;
__decorate([
    (0, common_1.Post)("bulk-enable"),
    __param(0, (0, common_1.Body)(new zod_pipe_1.ZodPipe(pages_dto_1.BulkEnableSchema))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PagesController.prototype, "bulkEnable", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("competitorId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PagesController.prototype, "list", null);
exports.PagesController = PagesController = __decorate([
    (0, common_1.Controller)("api/pages"),
    __metadata("design:paramtypes", [pages_service_1.PagesService])
], PagesController);
//# sourceMappingURL=pages.controller.js.map