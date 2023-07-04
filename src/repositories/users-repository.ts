import { Prisma, User } from "@prisma/client";

export interface UserRepository {
  create(data: Prisma.UserCreateInput): Promise<User>;
  findById(id: string): Promise<User | null | undefined>;
  findByEmail(email: string): Promise<User | null | undefined>;
}
