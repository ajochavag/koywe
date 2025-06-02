import { Schema, Document } from 'mongoose';

export interface UserModel extends Document {
  username: string;
  password: string;
}

export const UserSchema = new Schema<UserModel>(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    password: { type: String, required: true },
  }
);
