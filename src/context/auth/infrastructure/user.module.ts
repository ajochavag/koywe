import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserMongoRepository } from './repository/UserMongoRepository';
import { UserSchema } from './repository/models/UserModel';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'user', schema: UserSchema }]),
  ],
  providers: [
    {
      provide: 'UserRepository',
      useClass: UserMongoRepository,
    },
  ],
  exports: ['UserRepository'],
})
export class UserModule { }
