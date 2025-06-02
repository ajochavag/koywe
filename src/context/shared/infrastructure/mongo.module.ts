import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import config from 'src/app/config';

@Module({
  imports: [
    MongooseModule.forRoot(config.DATABASE.CONNECTION),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule { }
