import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt, IsEmail, IsOptional } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  user_name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  firebaseToken: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  last_name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  genderId: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  roleId: number;
}

export class FindUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;
}

export class UpdateUserDto extends CreateUserDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  id: number;
}

export class AuthenticateUserDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  firebaseToken: string;
}

export class DeleteUserDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  id: number;
}
