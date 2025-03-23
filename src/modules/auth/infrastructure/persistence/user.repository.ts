import { PrismaService } from '@/modules/common/infrastructure/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { UserRepository as IUserRepository } from '../../application/repository/user.repository';
import { User } from '@prisma/client';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(username: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return null;
    }

    return user;
  }

  async createUser(user: User): Promise<User> {
    const createdUser = await this.prisma.user.create({
      data: user,
    });

    return createdUser;
  }
}
