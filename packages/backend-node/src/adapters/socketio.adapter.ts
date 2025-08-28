import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { ConfigService } from '@nestjs/config';
import { INestApplication } from '@nestjs/common';

export class SocketIOAdapter extends IoAdapter {
  constructor(
    private app: INestApplication,
    private configService: ConfigService,
  ) {
    super(app);
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const corsOrigins = this.configService
      .get('CORS_ORIGINS', 'http://localhost:3000')
      .split(',');

    const optionsWithCORS: ServerOptions = {
      ...options,
      cors: {
        origin: corsOrigins,
        credentials: true,
      },
    };

    return super.createIOServer(port, optionsWithCORS);
  }
}