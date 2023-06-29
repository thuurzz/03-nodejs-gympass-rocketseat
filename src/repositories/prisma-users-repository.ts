import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export class PrismaUsersRepository {
  async create(data: Prisma.UserCreateInput) {
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
}
