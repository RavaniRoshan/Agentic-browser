import { Injectable } from '@nestjs/common';
import { WebsocketGateway } from '../websocket/websocket.gateway';

@Injectable()
export class EventsService {
  constructor(private websocketGateway: WebsocketGateway) {}

  async emitTaskStatusUpdate(taskId: string, status: string) {
    this.websocketGateway.emitTaskStatusUpdate(taskId, status);
  }

  async emitTaskEvent(taskId: string, event: any) {
    this.websocketGateway.emitTaskEvent(taskId, event);
  }

  async emitBrowserActivity(taskId: string, activity: any) {
    this.websocketGateway.emitBrowserActivity(taskId, activity);
  }

  async broadcast(event: string, data: any) {
    this.websocketGateway.broadcast(event, data);
  }
}