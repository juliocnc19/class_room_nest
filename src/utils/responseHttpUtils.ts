import { HttpException, HttpStatus } from "@nestjs/common";

export function successResponse<T>(data: T, message = 'Success'): ApiResponse<T> {
  return {
    code: HttpStatus.OK,
    message,
    data,
  };
}
  
export function errorResponse<T>(message: string, code: number, data: T = null): ApiResponse<T> {
  
  return {
    code,
    message,
    data,
  };
}



  export interface ApiResponse<T> {
    code: number;
    message: string;
    data: T;
  }