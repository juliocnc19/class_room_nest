import { HttpException, HttpStatus } from "@nestjs/common";

export function successResponse(data: any, message = 'Success') {
    return {
      code: HttpStatus.OK,
      message,
      data,
    };
  }
  
  export function errorResponse(message: string, code: number, data = {}) {
    throw new HttpException(
      {
        code,
        message,
        data,
      },
      code,
    );
  }