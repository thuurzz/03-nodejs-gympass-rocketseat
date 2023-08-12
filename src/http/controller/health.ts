import { FastifyReply, FastifyRequest } from "fastify";

export async function health(request: FastifyRequest, reply: FastifyReply) {
  reply.status(200).send({ status: "ok" });
}
