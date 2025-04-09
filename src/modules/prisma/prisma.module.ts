import { Global, Module } from '@nestjs/common';
import { PrismaDAL } from './prisma.dal';

@Global()
@Module({
  providers: [PrismaDAL],
  exports: [PrismaDAL],
})
export class PrismaModule {}