import { HttpException, HttpStatus } from "@nestjs/common";

export function successResponse<T>(data: T, message = 'Success'): ApiResponse<T> {
  return {
    code: HttpStatus.OK,
    message,
    data,
  };
}
  
export function errorResponse<T>(message: string, code: number, data: T = null): ApiResponse<T> {
  
  throw new HttpException(
    {
      code,
      message,
      data,
    },
    code, // Set HTTP status code properly
  );

}

//This is the correct way

// export function errorResponse<T>(message: string, code: number, data: T = null): never {
//   throw new HttpException(
//     {
//       code,
//       message,
//       data,
//     },
//     code // Ensure correct HTTP status code is set
//   );
// }


  export interface ApiResponse<T> {
    code: number;
    message: string;
    data: T;
  }