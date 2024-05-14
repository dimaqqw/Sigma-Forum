import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as fs from 'fs'

const httpsOptions = {
  key: fs.readFileSync('./secrets/cert.key'),
  cert: fs.readFileSync('./secrets/cert.crt'),
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { httpsOptions })
  app.setGlobalPrefix('api')
  app.enableCors()
  await app.listen(3000)
}
bootstrap()
