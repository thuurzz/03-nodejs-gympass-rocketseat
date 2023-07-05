import { GetResult } from "@prisma/client/runtime";
import { UserRepository } from "../users-repository";
import { User, Prisma } from "@prisma/client";
import { randomUUID } from "crypto";

export class InMemoryUsersRepository implements UserRepository {
  public users: User[] = [];

  async create(data: Prisma.UserCreateInput) {
    const user = {
      id: randomUUID(),
      ...data,
      created_at: new Date(),
    };
    this.users.push(user);
    return user;
  }

  async findByEmail(email: string) {
    const user = this.users.find((user) => user.email === email);
    return user;
  }

  async findById(id: string) {
    const user = this.users.find((user) => user.id === id);
    return user;
  }
}
