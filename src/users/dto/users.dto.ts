import { IsString, IsNotEmpty, IsInt, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsInt()
  @IsNotEmpty()
  roleId: number;

  @IsEmail()
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

export class FindUserDto {
  @IsString()
  @IsNotEmpty()
  email: string;
}

export class UpdateUserDto extends CreateUserDto {
  @IsInt()
  @IsNotEmpty()
  id: number;
}
