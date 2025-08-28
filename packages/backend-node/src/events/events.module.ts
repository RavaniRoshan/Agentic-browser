import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { WebsocketModule } from '../websocket/websocket.module';

@Module({
  imports: [WebsocketModule],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}