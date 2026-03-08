"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BulkEnableSchema = void 0;
const zod_1 = require("zod");
exports.BulkEnableSchema = zod_1.z.object({
    competitorId: zod_1.z.string().uuid(),
    urls: zod_1.z.array(zod_1.z.string().min(1)).min(1),
    intervalMin: zod_1.z.number().int().min(5).max(1440),
});
//# sourceMappingURL=pages.dto.js.map