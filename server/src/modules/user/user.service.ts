/**
 * Servicio de usuario que interactúa con el modelo `user` en la base de datos utilizando Prisma como ORM.
 *
 * Consideraciones:
 * - Utiliza `PrismaDAL` como dependencia para interactuar con la base de datos.
 * - La constante `prisma` se utiliza para definir el tipo `Users` y está desactivada temporalmente para evitar advertencias de variables no utilizadas.
 *
 * NOTAS:
 * La línea `// eslint-disable-next-line @typescript-eslint/no-unused-vars` se utiliza para desactivar temporalmente la regla `@typescript-eslint/no-unused-vars`, ya que la constante `prisma` es declarada pero no se utiliza en el código.
 * Esta desactivación es necesaria para evitar que ESLint arroje un error innecesario debido a la variable no utilizada, ya que la constante es utilizada solo para definir el tipo `Users`.
 * Esta situación es esperada en este caso porque el archivo está utilizando `prisma` para definir el tipo y no se espera una instancia activa del cliente Prisma en este archivo.
 */

import { Injectable, ConflictException } from '@nestjs/common';  
import { PrismaDAL } from '../prisma/prisma.dal';
import { PrismaClient } from '@prisma/client';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const prisma = new PrismaClient();
export type Users = Awaited<ReturnType<typeof prisma.user.findFirst>>;

@Injectable()
export class UserService {
  constructor(private prisma: PrismaDAL) {}

  async create(data: { email: string; password: string; username: string }): Promise<Users> {
    try{
      return this.prisma.user.create({
        data: {
          email: data.email,
          password: data.password,
          username: data.username,
        },
      });
    }catch(error){
      if (error.code === 'P2002') {
       throw new ConflictException(`El usuario con este ${error.meta.target[0]} ya existe`);
      }
     throw error;
    }
  }

  async findByUsername(username: string) {
    return this.prisma.user.findUnique({ where: { username } });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }
}
