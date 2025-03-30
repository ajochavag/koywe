import { AuthService, UserRepository, UserService } from '@monorepo/core-domain-services';
import { CreateUserUseCase, GetUserUseCase } from '@monorepo/core-use-cases';
import { AuthServiceImpl, PrismaUserRepository, UserServiceImpl } from '@monorepo/infrastructure';
import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { AuthController } from './auth.controller';

const prismaClientProvider = {
  provide: PrismaClient,
  useFactory: () => {
    return new PrismaClient();
  },
};

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [
    prismaClientProvider,
    {
      provide: UserRepository,
      useFactory: (prismaClient: PrismaClient) => new PrismaUserRepository(prismaClient),
      inject: [PrismaClient],
    },
    {
      provide: UserService,
      useFactory: (userRepository: UserRepository) => new UserServiceImpl(userRepository),
      inject: [UserRepository],
    },
    {
      provide: AuthService,
      useFactory: (userService: UserService) => new AuthServiceImpl(userService),
      inject: [UserService],
    },
    {
      provide: CreateUserUseCase,
      useFactory: (authService: AuthService) => {
        return new CreateUserUseCase(authService);
      },
      inject: [AuthService],
    },
    {
      provide: GetUserUseCase,
      useFactory: (authService: AuthService) => {
        return new GetUserUseCase(authService);
      },
      inject: [AuthService],
    },
  ],
})
export class AuthModule {}
