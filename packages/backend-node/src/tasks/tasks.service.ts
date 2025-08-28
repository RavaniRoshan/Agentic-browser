import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventsService } from '../events/events.service';
import { Task, TaskStatus, EventType } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(
    private prisma: PrismaService,
    private eventsService: EventsService,
  ) {}

  async findAll(): Promise<Task[]> {
    return this.prisma.task.findMany({
      include: {
        actions: true,
        events: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string): Promise<Task | null> {
    return this.prisma.task.findUnique({
      where: { id },
      include: {
        actions: {
          orderBy: { order: 'asc' },
        },
        events: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  async updateStatus(id: string, status: TaskStatus): Promise<Task> {
    const task = await this.prisma.task.update({
      where: { id },
      data: {
        status,
        updatedAt: new Date(),
        ...(status === TaskStatus.COMPLETED || status === TaskStatus.FAILED
          ? { completedAt: new Date() }
          : {}),
      },
    });

    // Emit real-time event
    await this.eventsService.emitTaskStatusUpdate(id, status);

    // Log event
    await this.logTaskEvent(id, this.getEventTypeFromStatus(status), `Task status updated to ${status}`);

    return task;
  }

  async logTaskEvent(taskId: string, type: EventType, message: string, data?: any): Promise<void> {
    await this.prisma.taskEvent.create({
      data: {
        taskId,
        type,
        message,
        data: data ? JSON.parse(JSON.stringify(data)) : null,
      },
    });

    // Emit real-time event
    await this.eventsService.emitTaskEvent(taskId, {
      type,
      message,
      data,
      timestamp: new Date(),
    });
  }

  private getEventTypeFromStatus(status: TaskStatus): EventType {
    switch (status) {
      case TaskStatus.RUNNING:
        return EventType.TASK_STARTED;
      case TaskStatus.COMPLETED:
        return EventType.TASK_COMPLETED;
      case TaskStatus.FAILED:
        return EventType.TASK_FAILED;
      default:
        return EventType.TASK_STARTED;
    }
  }
}