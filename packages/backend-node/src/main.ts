import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { SocketIOAdapter } from './adapters/socketio.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Get configuration
  const configService = app.get(ConfigService);
  const port = configService.get('PORT', 3001);
  const corsOrigins = configService.get('CORS_ORIGINS', 'http://localhost:3000').split(',');
  
  // Configure CORS
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });
  
  // Configure validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  
  // Configure WebSocket adapter
  app.useWebSocketAdapter(new SocketIOAdapter(app, configService));
  
  // Global prefix
  app.setGlobalPrefix('api/node');
  
  await app.listen(port);
  
  console.log(`🚀 Node.js backend running on http://localhost:${port}`);
  console.log(`📡 WebSocket server ready for real-time communication`);
}

bootstrap();