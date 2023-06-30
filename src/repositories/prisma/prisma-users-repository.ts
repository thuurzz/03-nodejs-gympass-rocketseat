import { prisma } from "@/lib/prisma";
import { Prisma, User } from "@prisma/client";
import { UserRepository } from "../users-repository";
import { GetResult } from "@prisma/client/runtime";

export class PrismaUsersRepository implements UserRepository {
  async create(data: Prisma.UserCreateInput): Promise<User> {
    const { email, name, password_hash } = data;
    const user = await prisma.user.create({
      data: {
        email,
        password_hash,
        name,
      },
    });
    return user;
  }

  async findByEmail(email: string): Promise<User | null | undefined> {
    const userAlreadyExists = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    return userAlreadyExists;
  }
}
