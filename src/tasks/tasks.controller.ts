import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskEntity } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { FilterTasksDto } from './dto/filter-tasks.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  public async createTask(@Body() dto: CreateTaskDto): Promise<TaskEntity> {
    return await this.tasksService.createTask(dto);
  }

  @Get()
  public async findAllTasks(@Query() filter: FilterTasksDto): Promise<TaskEntity[]> {
    return await this.tasksService.findAllTasks(filter);
  }

  @Get(':id')
  public async findTaskById(@Param('id') id: string): Promise<TaskEntity> {
    return await this.tasksService.findTaskById(id);
  }

  @Put(':id')
  public async updateTaskById(
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
  ): Promise<TaskEntity> {
    return await this.tasksService.updateTaskById(id, dto);
  }

  @Delete(':id')
  public async removeTaskById(@Param('id') id: string): Promise<{ message: string }> {
    return await this.tasksService.removeTaskById(id);
  }
}
