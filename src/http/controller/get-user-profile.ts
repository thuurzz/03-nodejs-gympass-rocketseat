import { ResourceNotFoundError } from "@/use-case/errors/resource-not-found-error";
import { makePrismaGetUserProfileUseCase } from "@/use-case/factotories/make-prisma-get-user-profile-use-case";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export async function getUserProfile(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const getUserProfileBodySchema = z.object({
    id: z.string(),
  });

  const { id } = getUserProfileBodySchema.parse(request.params);

  try {
    const getUserProfileUseCase = makePrismaGetUserProfileUseCase();
    const user = await getUserProfileUseCase.execute({ id });
    reply.status(200).send(user);
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      reply.status(400).send({ message: err.message });
      return;
    }
    reply.status(500).send({ message: "Internal server error" }); // TODO: log error
    return;
  }
}
