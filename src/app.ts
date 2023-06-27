import fastify from "fastify";
import { z } from "zod";
import { prisma } from "./lib/prisma";

export const app = fastify();

app.post("/users", async (request, reply) => {
  const registerBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(100),
    name: z.string().min(2).max(100),
  });

  const { email, password, name } = registerBodySchema.parse(request.body);

  await prisma.user.create({
    data: {
      email,
      password_hash: password,
      name,
    },
  });

  reply.status(201).send();

});
