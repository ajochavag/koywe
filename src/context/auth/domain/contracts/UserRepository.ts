import { User } from "../class/User";

export interface UserRepository {
  searchByUsername(username: string): Promise<User | null>
  create(username: string, hashedPassword: string): Promise<void>;
}