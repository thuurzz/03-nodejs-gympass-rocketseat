import { prisma } from "@/lib/prisma";
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

  await prisma.user.create({
    data: {
      email,
      password_hash: password_hash,
      name,
    },
  });
}
