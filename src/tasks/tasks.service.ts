import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskEntity } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { FilterTasksDto } from './dto/filter-tasks.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskMessages } from './tasks.constants';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  /**
   * @param taskRepository Task repository for interaction with the DB
   */

  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
  ) {}

  /**
   * Creates a new task based on the passed data
   *
   * @param dto Data for creating a task
   * @returns Created task
   * @throws HttpException 500, if there was a saving error
   */
  public async createTask(dto: CreateTaskDto): Promise<TaskEntity> {
    try {
      const newTask = this.taskRepository.create(dto);
      const savedTask = await this.taskRepository.save(newTask);
      this.logger.log(`Task created: ${savedTask.id}`);

      return savedTask;
    } catch (err: unknown) {
      this.logger.error('Task creation failed', (err as Error).stack);
      throw new HttpException(TaskMessages.CREATE_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Gets a list of tasks with support for filtering by status and pagination
   *
   * @param filter Filtering and pagination options
   * @returns List of tasks
   * @throws HttpException 500, if a request error occurs
   */
  public async findAllTasks(filter: FilterTasksDto): Promise<TaskEntity[]> {
    try {
      const { status, page = 1, limit = 10 } = filter;
      const query = this.taskRepository.createQueryBuilder('task');

      if (status) {
        query.andWhere('task.status = :status', { status });
      }

      query.skip((page - 1) * limit).take(limit);

      const tasks = await query.getMany();
      this.logger.log(`Fetched ${tasks.length} tasks`);

      return tasks;
    } catch (err: unknown) {
      this.logger.error('Fetching tasks failed', (err as Error).stack);
      throw new HttpException(TaskMessages.FETCH_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Returns a task by its ID
   *
   * @param id Task ID
   * @returns Found task
   * @throws HttpException 404, if a task not found
   */
  public async findTaskById(id: string): Promise<TaskEntity> {
    const task = await this.taskRepository.findOneBy({ id });
    if (!task) {
      this.logger.warn(`Task not found: ${id}`);
      throw new HttpException(TaskMessages.NOT_FOUND(id), HttpStatus.NOT_FOUND);
    }

    return task;
  }

  /**
   * Updates the task by ID based on the passed data
   *
   * @param id  Task ID
   * @param dto Data to update
   * @returns Updated task
   * @throws HttpException 404, if a task not found
   * @throws HttpException 500, if saving failed
   */
  public async updateTaskById(id: string, dto: UpdateTaskDto): Promise<TaskEntity> {
    const task = await this.findTaskById(id);
    try {
      Object.assign(task, dto);
      const updatedTask = await this.taskRepository.save(task);
      this.logger.log(`Task updated: ${id}`);

      return updatedTask;
    } catch (err: unknown) {
      this.logger.error(`Task update failed: ${id}`, (err as Error).stack);
      throw new HttpException(TaskMessages.UPDATE_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Deletes a task by ID
   *
   * @param id Task ID
   * @returns Successful deletion message
   * @throws HttpException 404, if a task not found
   * @throws HttpException 500, if there was a deletion error
   */
  public async removeTaskById(id: string): Promise<{ message: string }> {
    try {
      const result = await this.taskRepository.delete(id);
      if (result.affected === 0) {
        this.logger.warn(`Attempted to delete non-existent task: ${id}`);
        throw new HttpException(TaskMessages.NOT_FOUND(id), HttpStatus.NOT_FOUND);
      }

      this.logger.log(`Task deleted: ${id}`);
      return { message: 'Task deleted successfully' };
    } catch (err: unknown) {
      if (err instanceof HttpException) throw err;
      this.logger.error(`Task deletion failed: ${id}`, (err as Error).stack);
      throw new HttpException(TaskMessages.DELETE_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
