import "dotenv/config"
import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { ConfigService } from "@nestjs/config"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const cfg = app.get(ConfigService)
  const port = Number(cfg.get("PORT") ?? 4000)

  app.enableCors({
    origin: [
      "http://85.198.101.94:3002",
      "http://localhost:3000",
      "http://localhost:3002",
    ],
    credentials: true,
  })

  await app.listen(port, "0.0.0.0")
  console.log(`API listening on http://localhost:${port}`)
}

bootstrap()
