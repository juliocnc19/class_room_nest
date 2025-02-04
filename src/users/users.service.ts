import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { Users } from './users.interface';
import {
  AuthenticateUserDto,
  CreateUserDto,
  UpdateUserDto,
  UpdateUserRoleDto,
} from './dto/users.dto';
import { errorResponse, successResponse } from 'src/utils/responseHttpUtils';

@Injectable()
export class UsersService implements Users {
  constructor(private readonly prismaService: PrismaService) {}

  async create(user: CreateUserDto): Promise<any> {
    try {
      const validationUser = await this.prismaService.user.findMany({
        where: {
          OR: [{ email: user.email }, { user_name: user.user_name }],
        },
      });

      if (validationUser.length > 0) {
        return errorResponse('El usuario ya existe', HttpStatus.CONFLICT);
      }

      const newUser = await this.prismaService.user.create({ data: user });
      return successResponse(newUser, 'Usuario creado exitosamente');
    } catch (error) {
      return errorResponse('Error al crear el usuario', HttpStatus.INTERNAL_SERVER_ERROR, error);
    }
  }

  async find(email: string): Promise<any> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { email },
      });

      if (!user) {
        return errorResponse('El usuario no existe', HttpStatus.NOT_FOUND);
      }

      return successResponse(user, 'Usuario encontrado exitosamente');
    } catch (error) {
      return errorResponse('Error al buscar el usuario', HttpStatus.INTERNAL_SERVER_ERROR, error);
    }
  }

  async findMany(): Promise<any> {
    try {
      const users = await this.prismaService.user.findMany();
      return successResponse(users, 'Lista de usuarios obtenida exitosamente');
    } catch (error) {
      return errorResponse('Error al obtener la lista de usuarios', HttpStatus.INTERNAL_SERVER_ERROR, error);
    }
  }

  async update(user: UpdateUserDto): Promise<any> {
    try {
      const userFound = await this.prismaService.user.findUnique({
        where: { id: user.id },
      });

      if (!userFound) {
        return errorResponse('El usuario no existe', HttpStatus.NOT_FOUND);
      }

      const updatedUser = await this.prismaService.user.update({
        where: { id: user.id },
        data: user,
      });
      return successResponse(updatedUser, 'Usuario actualizado exitosamente');
    } catch (error) {
      return errorResponse('Error al actualizar el usuario', HttpStatus.INTERNAL_SERVER_ERROR, error);
    }
  }

  async authenticate(user: AuthenticateUserDto): Promise<any> {
    try {
      const userFind = await this.prismaService.user.findUnique({
        where: { email: user.email },
      });

      if (!userFind) {
        return errorResponse('El usuario no existe', HttpStatus.UNAUTHORIZED);
      }

      const isPasswordValid = user.password === userFind.password;
      if (!isPasswordValid) {
        return errorResponse('Credenciales inválidas', HttpStatus.UNAUTHORIZED);
      }

      if (user.firebaseToken) {
        await this.prismaService.user.update({
          where: { id: userFind.id },
          data: { firebaseToken: user.firebaseToken },
        });
      }

      return successResponse(userFind, 'Autenticación exitosa');
    } catch (error) {
      return errorResponse('Error al autenticar el usuario', HttpStatus.INTERNAL_SERVER_ERROR, error);
    }
  }

  async delete(userId: number): Promise<any> {
    try {
      const userFind = await this.prismaService.user.findUnique({
        where: { id: userId },
      });

      if (!userFind) {
        return errorResponse('El usuario no existe', HttpStatus.NOT_FOUND);
      }

      await this.prismaService.user.delete({ where: { id: userId } });
      return successResponse(null, 'Usuario eliminado exitosamente');
    } catch (error) {
      return errorResponse('Error al eliminar el usuario', HttpStatus.INTERNAL_SERVER_ERROR, error);
    }
  }

  async updateUserRole(updateUserRoleDto: UpdateUserRoleDto): Promise<any> {
    const { userId, roleId } = updateUserRoleDto;
  
    try {
      // Verificar si el usuario existe
      const user = await this.prismaService.user.findUnique({ where: { id: userId } });
      if (!user) {
        return errorResponse('El usuario no existe', HttpStatus.NOT_FOUND);
      }
  
      // Verificar si el rol existe
      const role = await this.prismaService.role.findUnique({ where: { id: roleId } });
      if (!role) {
        return errorResponse('El rol especificado no existe', HttpStatus.NOT_FOUND);
      }
  
      // Actualizar el rol del usuario
      const updatedUser = await this.prismaService.user.update({
        where: { id: userId },
        data: { roleId },
      });
  
      return successResponse(updatedUser, 'Rol de usuario actualizado exitosamente');
    } catch (error) {
      return errorResponse('Error al actualizar el rol del usuario', HttpStatus.INTERNAL_SERVER_ERROR, error);
    }
  }
  

 
}
