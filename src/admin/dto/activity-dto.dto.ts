import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { DecimalJsLike } from '@prisma/client/runtime/library';
import { IsString, IsNotEmpty, IsOptional, IsInt, IsDecimal } from 'class-validator';

export class CreateActivityDto implements Prisma.ActivitiesCreateInput {
    course: Prisma.CourseCreateNestedOneWithoutActivitiesInput;
    @ApiProperty({ example: 1 })
    @IsInt()
    @IsNotEmpty()
    course_id: number;
  
    @ApiProperty({ example: 'Activity Title' })
    @IsString()
    @IsNotEmpty()
    title: string;
  
    @ApiProperty({ example: 'Activity Description' })
    @IsString()
    @IsNotEmpty()
    description: string;
  
    @ApiProperty({ example: 'example@example.com' })
    @IsString()
    email: string;
  
    @ApiProperty({ example: '100' })
    @IsDecimal()
    grade: Prisma.Decimal;
  
    @ApiProperty({ example: '2024-01-01' })
    @IsString()
    start_date: string;
  
    @ApiProperty({ example: '2024-01-15' })
    @IsString()
    end_date: string;
  
    @ApiProperty({ example: true })
    @IsOptional()
    digital?: boolean;
  
    @ApiProperty()
    @IsNotEmpty()
    status: Prisma.StatusCreateNestedOneWithoutActivitiesInput;
  
    @ApiProperty()
    @IsOptional()
    activities_send?: Prisma.ActivitiesSentCreateNestedManyWithoutActivityInput;
  
    @ApiProperty()
    @IsOptional()
    quizz?: Prisma.QuizzCreateNestedManyWithoutActivityInput;
  }
  

  export class UpdateActivityDto implements Prisma.ActivitiesUpdateInput {
    @IsString()
    @IsOptional()
    title?: string;
  
    @IsString()
    @IsOptional()
    description?: string;
  
    @IsDecimal()
    @IsOptional()
    grade?: number;
  
    @IsString()
    @IsOptional()
    start_date?: string;
  
    @IsString()
    @IsOptional()
    end_date?: string;
  
    @IsString()
    @IsOptional()
    email?: string;
  
    @IsOptional()
    digital?: boolean;
  
    @IsInt()
    @IsOptional()
    course_id?: number;
  
    @IsOptional()
    status?: Prisma.StatusCreateNestedOneWithoutActivitiesInput;
  }