import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { UserRepository } from "./users-repository";
import { GetResult } from "@prisma/client/runtime";

export class PrismaUsersRepository implements UserRepository {
  async create(data: Prisma.UserCreateInput): Promise<
    GetResult<
      {
        id: string;
        email: string;
        name: string;
        password_hash: string;
        createdAt: Date;
      },
      unknown
    > & {}
  > {
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

  async findByEmail(email: string): Promise<
    | (GetResult<
        {
          id: string;
          email: string;
          name: string;
          password_hash: string;
          createdAt: Date;
        },
        unknown
      > & {})
    | null
  > {
    const userAlreadyExists = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    return userAlreadyExists;
  }
}
