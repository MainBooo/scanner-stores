"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const config_1 = require("@nestjs/config");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const cfg = app.get(config_1.ConfigService);
    const port = Number(cfg.get("PORT") ?? 4000);
    app.enableCors({
        origin: [
            "http://85.198.101.94:3002",
            "http://localhost:3000",
            "http://localhost:3002",
        ],
        credentials: true,
    });
    await app.listen(port, "0.0.0.0");
    console.log(`API listening on http://localhost:${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map