import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from '../tasks.controller';
import { TasksService } from '../tasks.service';
import { TaskEntity, TaskStatus } from '../entities/task.entity';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';

describe('TasksController', () => {
  let controller: TasksController;

  const createTaskMock = jest.fn();
  const findAllTasksMock = jest.fn();
  const findTaskByIdMock = jest.fn();
  const updateTaskByIdMock = jest.fn();
  const removeTaskByIdMock = jest.fn();

  const mockTask: TaskEntity = {
    id: '1',
    title: 'Test Task',
    description: 'Some description',
    status: TaskStatus.PENDING,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: {
            createTask: createTaskMock,
            findAllTasks: findAllTasksMock,
            findTaskById: findTaskByIdMock,
            updateTaskById: updateTaskByIdMock,
            removeTaskById: removeTaskByIdMock,
          },
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);

    jest.clearAllMocks();

    createTaskMock.mockResolvedValue(mockTask);
    findAllTasksMock.mockResolvedValue([mockTask]);
    findTaskByIdMock.mockResolvedValue(mockTask);
    updateTaskByIdMock.mockResolvedValue({ ...mockTask, status: TaskStatus.COMPLETED });
    removeTaskByIdMock.mockResolvedValue({ message: 'Task deleted successfully' });
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createTask', () => {
    it('should create a task', async () => {
      const dto: CreateTaskDto = { title: 'Test', description: 'Some description' };
      const result = await controller.createTask(dto);
      expect(result).toEqual(mockTask);
      expect(createTaskMock).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAllTasks', () => {
    it('should return a list of tasks', async () => {
      const result = await controller.findAllTasks({});
      expect(result).toEqual([mockTask]);
      expect(findAllTasksMock).toHaveBeenCalledWith({});
    });
  });

  describe('findTaskById', () => {
    it('should return a task by ID', async () => {
      const result = await controller.findTaskById('1');
      expect(result).toEqual(mockTask);
      expect(findTaskByIdMock).toHaveBeenCalledWith('1');
    });
  });

  describe('updateTaskById', () => {
    it('should update and return the task', async () => {
      const dto: UpdateTaskDto = { status: TaskStatus.COMPLETED };
      const result = await controller.updateTaskById('1', dto);
      expect(result.status).toBe(TaskStatus.COMPLETED);
      expect(updateTaskByIdMock).toHaveBeenCalledWith('1', dto);
    });
  });

  describe('removeTaskById', () => {
    it('should delete the task and return confirmation', async () => {
      const result = await controller.removeTaskById('1');
      expect(result).toEqual({ message: 'Task deleted successfully' });
      expect(removeTaskByIdMock).toHaveBeenCalledWith('1');
    });
  });
});
