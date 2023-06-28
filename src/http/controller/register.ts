import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { hash } from "bcryptjs";

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(100),
    name: z.string().min(2).max(100),
  });

  const { email, password, name } = registerBodySchema.parse(request.body);

  const password_hash = await hash(password, 6);

  const userWithEmail = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (userWithEmail) {
    reply.status(409).send({
      error: "Email already in use",
    });
    return;
  }

  await prisma.user.create({
    data: {
      email,
      password_hash: password_hash,
      name,
    },
  });

  reply.status(201).send();
}
