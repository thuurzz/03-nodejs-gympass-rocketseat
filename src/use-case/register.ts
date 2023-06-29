import { prisma } from "@/lib/prisma";
import { PrismaUsersRepository } from "@/repositories/prisma-users-repository";
import { UserRepository } from "@/repositories/users-repository";
import { hash } from "bcryptjs";

type registerUseCaseParams = {
  email: string;
  password: string;
  name: string;
};

export class RegisterUseCase {
  constructor(private usersRepository: UserRepository) {}

  async execute({ email, name, password }: registerUseCaseParams) {
    const password_hash = await hash(password, 6);

    const userWithEmail = await this.usersRepository.findByEmail(email);
    if (userWithEmail) {
      throw new Error("Email already in use");
    }

    const user = await this.usersRepository.create({
      email,
      name,
      password_hash,
    });

    return user;
  }
}
