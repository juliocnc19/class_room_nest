import { IsString, IsNotEmpty, IsOptional, IsInt, IsDecimal } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    email: string;
  
    @IsString()
    @IsNotEmpty()
    password: string;
  
    @IsString()
    @IsNotEmpty()
    user_name: string;
  
    @IsString()
    @IsNotEmpty()
    name: string;
  
    @IsString()
    @IsNotEmpty()
    last_name: string;
  
    @IsString()
    @IsNotEmpty()
    phone: string;
  
    @IsInt()
    @IsNotEmpty()
    genderId: number;
  }
  
  export class UpdateUserDto {
    @IsString()
    @IsOptional()
    email?: string;
  
    @IsString()
    @IsOptional()
    password?: string;
  
    @IsString()
    @IsOptional()
    user_name?: string;
  
    @IsString()
    @IsOptional()
    name?: string;
  
    @IsString()
    @IsOptional()
    last_name?: string;
  
    @IsString()
    @IsOptional()
    phone?: string;
  
    @IsInt()
    @IsOptional()
    genderId?: number;
  }