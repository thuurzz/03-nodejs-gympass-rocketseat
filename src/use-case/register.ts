import { prisma } from "@/lib/prisma";
import { PrismaUsersRepository } from "@/repositories/prisma-users-repository";
import { hash } from "bcryptjs";

type registerUseCaseParams = {
  email: string;
  password: string;
  name: string;
};

export async function registerUseCase({
  email,
  name,
  password,
}: registerUseCaseParams) {
  const password_hash = await hash(password, 6);

  const userWithEmail = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (userWithEmail) {
    throw new Error("Email already in use");
  }

  const prismaUsersRepository = new PrismaUsersRepository();

  const user = await prismaUsersRepository.create({
    email,
    name,
    password_hash,
  });

  return user;
}