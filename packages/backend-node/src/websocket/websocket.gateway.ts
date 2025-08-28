import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
  },
})
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger = new Logger('WebsocketGateway');
  private connectedClients = new Map<string, Socket>();

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    this.connectedClients.set(client.id, client);
    
    // Send welcome message
    client.emit('connection', {
      message: 'Connected to Agentic Browser WebSocket',
      clientId: client.id,
    });
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.connectedClients.delete(client.id);
  }

  @SubscribeMessage('join-task')
  handleJoinTask(
    @MessageBody() data: { taskId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const room = `task-${data.taskId}`;
    client.join(room);
    this.logger.log(`Client ${client.id} joined task room: ${room}`);
    
    client.emit('joined-task', {
      taskId: data.taskId,
      message: `Joined task ${data.taskId} for real-time updates`,
    });
  }

  @SubscribeMessage('leave-task')
  handleLeaveTask(
    @MessageBody() data: { taskId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const room = `task-${data.taskId}`;
    client.leave(room);
    this.logger.log(`Client ${client.id} left task room: ${room}`);
  }

  // Emit task status updates
  emitTaskStatusUpdate(taskId: string, status: string) {
    const room = `task-${taskId}`;
    this.server.to(room).emit('task-status-update', {
      taskId,
      status,
      timestamp: new Date(),
    });
    this.logger.log(`Emitted status update for task ${taskId}: ${status}`);
  }

  // Emit task events
  emitTaskEvent(taskId: string, event: any) {
    const room = `task-${taskId}`;
    this.server.to(room).emit('task-event', {
      taskId,
      ...event,
    });
    this.logger.log(`Emitted event for task ${taskId}: ${event.type}`);
  }

  // Emit browser activity
  emitBrowserActivity(taskId: string, activity: any) {
    const room = `task-${taskId}`;
    this.server.to(room).emit('browser-activity', {
      taskId,
      ...activity,
    });
  }

  // Broadcast to all clients
  broadcast(event: string, data: any) {
    this.server.emit(event, data);
    this.logger.log(`Broadcasted event: ${event}`);
  }
}