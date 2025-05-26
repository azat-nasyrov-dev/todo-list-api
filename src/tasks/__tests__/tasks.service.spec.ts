import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from '../tasks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DeleteResult, SelectQueryBuilder } from 'typeorm';
import { TaskEntity, TaskStatus } from '../entities/task.entity';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';

describe('TasksService', () => {
  let service: TasksService;
  let repository: jest.Mocked<Repository<TaskEntity>>;
  let mockQueryBuilder: jest.Mocked<SelectQueryBuilder<TaskEntity>>;

  beforeEach(async () => {
    mockQueryBuilder = {
      andWhere: jest.fn().mockImplementation(() => mockQueryBuilder),
      skip: jest.fn().mockImplementation(() => mockQueryBuilder),
      take: jest.fn().mockImplementation(() => mockQueryBuilder),
      getMany: jest.fn(),
    } as unknown as jest.Mocked<SelectQueryBuilder<TaskEntity>>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(TaskEntity),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOneBy: jest.fn(),
            delete: jest.fn(),
            createQueryBuilder: jest.fn(() => mockQueryBuilder),
          },
        },
      ],
    }).compile();

    service = module.get(TasksService);
    repository = module.get(getRepositoryToken(TaskEntity));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createTask', () => {
    it('should create and return a task', async () => {
      const dto: CreateTaskDto = { title: 'Test', description: 'Desc' };
      const task: TaskEntity = {
        id: '1',
        title: dto.title,
        description: dto.description,
        status: TaskStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      repository.create.mockReturnValue(task);
      repository.save.mockResolvedValue(task);

      const result = await service.createTask(dto);
      expect(result).toEqual(task);
    });
  });

  describe('findTaskById', () => {
    it('should return a task', async () => {
      const task: TaskEntity = {
        id: '1',
        title: 'Sample',
        description: 'Desc',
        status: TaskStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      repository.findOneBy.mockResolvedValue(task);
      const result = await service.findTaskById('1');
      expect(result).toEqual(task);
    });

    it('should throw if not found', async () => {
      repository.findOneBy.mockResolvedValue(null);
      await expect(service.findTaskById('999')).rejects.toThrow('Task with ID 999 not found');
    });
  });

  describe('findAllTasks', () => {
    it('should return filtered and paginated tasks', async () => {
      const tasks: TaskEntity[] = [
        {
          id: '1',
          title: 'Test',
          description: 'Test desc',
          status: TaskStatus.PENDING,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockQueryBuilder.getMany.mockResolvedValue(tasks);

      const result = await service.findAllTasks({ page: 1, limit: 10 });
      expect(result).toEqual(tasks);
    });
  });

  describe('updateTaskById', () => {
    it('should update task and return updated task', async () => {
      const task: TaskEntity = {
        id: '1',
        title: 'Old',
        description: 'Desc',
        status: TaskStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const dto: UpdateTaskDto = { title: 'New' };

      repository.findOneBy.mockResolvedValue(task);
      repository.save.mockResolvedValue({ ...task, ...dto });

      const result = await service.updateTaskById('1', dto);
      expect(result.title).toBe(dto.title);
    });
  });

  describe('removeTaskById', () => {
    it('should delete task and return success message', async () => {
      const deleteResult: DeleteResult = { affected: 1, raw: {} };
      repository.delete.mockResolvedValue(deleteResult);

      const result = await service.removeTaskById('1');
      expect(result).toEqual({ message: 'Task deleted successfully' });
    });

    it('should throw if task not deleted', async () => {
      const failed: DeleteResult = { affected: 0, raw: {} };
      repository.delete.mockResolvedValue(failed);

      await expect(service.removeTaskById('123')).rejects.toThrow('Task with ID 123 not found');
    });
  });
});
