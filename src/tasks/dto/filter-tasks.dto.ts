import { IsEnum, IsOptional, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';
import { TaskStatus } from '../entities/task.entity';

export class FilterTasksDto {
  @IsOptional()
  @IsEnum(TaskStatus)
  readonly status?: TaskStatus;

  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  readonly page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  readonly limit?: number;
}
