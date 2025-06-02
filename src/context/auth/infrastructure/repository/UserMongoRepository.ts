import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserRepository } from "../../domain/contracts/UserRepository";
import { InjectModel } from '@nestjs/mongoose';
import { User } from "../../domain/class/User";
import { UserModel } from "./models/UserModel";
import { Model } from "mongoose";

Injectable()
export class UserMongoRepository implements UserRepository {
  constructor(@InjectModel('user') private userModel: Model<UserModel>) { }

  async create(username: string, hashedPassword: string): Promise<void> {
    const user = new this.userModel({ username, password: hashedPassword });
    user.save();
  }

  async searchByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ username }).exec();
  }
}