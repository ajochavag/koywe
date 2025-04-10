import { Injectable } from '@nestjs/common';
import { PrismaDAL } from '../prisma/prisma.dal';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export type Users = Awaited<ReturnType<typeof prisma.user.findFirst>>;

@Injectable()
export class UserService {
  constructor(private prisma: PrismaDAL) {}

  async create(data: { email: string; password: string; username: string }): Promise<Users> {

    return this.prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        username: data.username,
      },
    });
  }
  
  async findByUsername(username: string) {
    return this.prisma.user.findUnique({ where: { username } });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }
}
