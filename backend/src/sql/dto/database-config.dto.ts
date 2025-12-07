import { IsInt, IsObject, IsOptional, IsString, Min } from 'class-validator';
import { IsSelectOnly } from './validators/select-only.validator';

export class DatabaseConfigDto {
  @IsString()
  host: string;

  @IsInt()
  @Min(1)
  port: number;

  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsString()
  database: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  requestTimeout?: number = 15000;

  @IsString()
  @IsSelectOnly()
  query: string;

  @IsOptional()
  @IsObject()
  params?: { [key: string]: any };
}
