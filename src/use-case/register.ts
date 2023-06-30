import { prisma } from "@/lib/prisma";
import { PrismaUsersRepository } from "@/repositories/prisma-users-repository";
import { UserRepository } from "@/repositories/users-repository";
import { hash } from "bcryptjs";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";
import { User } from "@prisma/client";

type registerUseCaseParams = {
  email: string;
  password: string;
  name: string;
};

interface RegisterUseCaseResponse {
  user: User;
}

export class RegisterUseCase {
  constructor(private usersRepository: UserRepository) {}

  async execute({
    email,
    name,
    password,
  }: registerUseCaseParams): Promise<RegisterUseCaseResponse> {
    const password_hash = await hash(password, 6);

    const userWithEmail = await this.usersRepository.findByEmail(email);
    if (userWithEmail) {
      throw new UserAlreadyExistsError();
    }

    const user = await this.usersRepository.create({
      email,
      name,
      password_hash,
    });

    return { user };
  }
}
