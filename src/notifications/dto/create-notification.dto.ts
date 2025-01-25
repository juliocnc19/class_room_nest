import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ArrayNotEmpty, IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';

export class NotificationDto {
  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty() // Ensures the array is not empty
  @IsString({ each: true }) // Ensures each element in the array is a string
  tokens: string[];

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  body: string;

  @ApiProperty()
  @IsObject()
  @IsOptional()
  data?: Record<string, string>;
}



export class NotificationToAllUsersDto {
  @ApiProperty({
    description: 'Title of the notification',
    example: 'System Update',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Body of the notification',
    example: 'We have rolled out new features for everyone!',
  })
  @IsString()
  @IsNotEmpty()
  body: string;

  @ApiProperty({
    description: 'Optional additional data to send with the notification',
    example: { key: 'value' },
    required: false,
  })
  @IsOptional()
  @IsObject()
  data?: Record<string, string>;
}