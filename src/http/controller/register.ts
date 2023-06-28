import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { registerUseCase } from "@/use-case/register";

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(100),
    name: z.string().min(2).max(100),
  });

  const { email, password, name } = registerBodySchema.parse(request.body);

  try {
    await registerUseCase({ email, password, name });
  } catch (error: any) {
    reply.status(409).send({ message: error.message });
    return;
  }

  reply.status(201).send();
}
