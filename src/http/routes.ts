import { FastifyInstance } from "fastify";
import { register } from "./controller/register";
import { authenticate } from "./controller/authenticate";
import { getUserProfile } from "./controller/get-user-profile";
import { health } from "./controller/health";

export async function appRoutes(app: FastifyInstance) {
  app.get("/health", health);

  app.post("/users", register);
  app.post("/sessions", authenticate);
  app.get("/users/:id", getUserProfile);
}
