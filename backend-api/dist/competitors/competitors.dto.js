"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCompetitorSchema = void 0;
const zod_1 = require("zod");
exports.CreateCompetitorSchema = zod_1.z.object({
    domain: zod_1.z.string().min(3),
    displayName: zod_1.z.string().optional(),
});
//# sourceMappingURL=competitors.dto.js.map