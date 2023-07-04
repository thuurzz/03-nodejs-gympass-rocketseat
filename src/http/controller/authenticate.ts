import { InvalidCredentialsError } from "@/use-case/errors/invalid-credentials-error";
import { makePrismaAuthenticateUseCase } from "@/use-case/factotories/make-prisma-authenticate-use-case";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(100),
  });

  const { email, password } = authenticateBodySchema.parse(request.body);

  try {
    const authenticateUseCase = makePrismaAuthenticateUseCase();

    await authenticateUseCase.execute({ email, password });
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      reply.status(400).send({ message: err.message });
      return;
    }
    reply.status(500).send({ message: "Internal server error" }); // TODO: log error
    return;
  }

  reply.status(200).send();
}
