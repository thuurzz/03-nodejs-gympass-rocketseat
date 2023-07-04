import { UserAlreadyExistsError } from "@/use-case/errors/user-already-exists-error";
import { makePrismaRegisterUseCase } from "@/use-case/factotories/make-prisma-register-use-case";

import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(100),
    name: z.string().min(2).max(100),
  });

  const { email, password, name } = registerBodySchema.parse(request.body);

  try {
    const registerUseCase = makePrismaRegisterUseCase();

    await registerUseCase.execute({ email, password, name });
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      reply.status(409).send({ message: err.message });
      return;
    }
    reply.status(500).send({ message: "Internal server error" }); // TODO: log error
    return;
  }

  reply.status(201).send();
}
