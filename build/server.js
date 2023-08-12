"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/app.ts
var import_fastify = __toESM(require("fastify"));

// src/use-case/errors/user-already-exists-error.ts
var UserAlreadyExistsError = class extends Error {
  constructor() {
    super("User already exists");
  }
};

// src/env/index.ts
var import_config = require("dotenv/config");
var import_zod = require("zod");
var envSchema = import_zod.z.object({
  PORT: import_zod.z.coerce.number().default(3e3),
  NODE_ENV: import_zod.z.enum(["dev", "test", "production"]).default("dev")
});
var _env = envSchema.safeParse(process.env);
if (!_env.success) {
  console.log("Invalid environment variables", _env.error.format());
  throw new Error("Invalid environment variables.");
}
var env = _env.data;

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient({
  log: env.NODE_ENV === "dev" ? ["query"] : []
});

// src/repositories/prisma/prisma-users-repository.ts
var PrismaUsersRepository = class {
  async create(data) {
    const { email, name, password_hash } = data;
    const user = await prisma.user.create({
      data: {
        email,
        password_hash,
        name
      }
    });
    return user;
  }
  async findByEmail(email) {
    const userAlreadyExists = await prisma.user.findUnique({
      where: {
        email
      }
    });
    return userAlreadyExists;
  }
  async findById(id) {
    const userAlreadyExists = await prisma.user.findUnique({
      where: {
        id
      }
    });
    return userAlreadyExists;
  }
};

// src/use-case/register.ts
var import_bcryptjs = require("bcryptjs");
var RegisterUseCase = class {
  constructor(usersRepository) {
    this.usersRepository = usersRepository;
  }
  async execute({
    email,
    name,
    password
  }) {
    const password_hash = await (0, import_bcryptjs.hash)(password, 6);
    const userWithEmail = await this.usersRepository.findByEmail(email);
    if (userWithEmail) {
      throw new UserAlreadyExistsError();
    }
    const user = await this.usersRepository.create({
      email,
      name,
      password_hash
    });
    return { user };
  }
};

// src/use-case/factotories/make-prisma-register-use-case.ts
function makePrismaRegisterUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const registerUseCase = new RegisterUseCase(usersRepository);
  return registerUseCase;
}

// src/http/controller/register.ts
var import_zod2 = require("zod");
async function register(request, reply) {
  const registerBodySchema = import_zod2.z.object({
    email: import_zod2.z.string().email(),
    password: import_zod2.z.string().min(6).max(100),
    name: import_zod2.z.string().min(2).max(100)
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
    reply.status(500).send({ message: "Internal server error" });
    return;
  }
  reply.status(201).send();
}

// src/use-case/errors/invalid-credentials-error.ts
var InvalidCredentialsError = class extends Error {
  constructor() {
    super("Invalid credentials");
  }
};

// src/use-case/authenticate.ts
var import_bcryptjs2 = require("bcryptjs");
var AuthenticateUseCase = class {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }
  async execute({
    email,
    password
  }) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new InvalidCredentialsError();
    }
    const doesPasswordMatch = await (0, import_bcryptjs2.compare)(password, user.password_hash);
    if (!doesPasswordMatch) {
      throw new InvalidCredentialsError();
    }
    return { user };
  }
};

// src/use-case/factotories/make-prisma-authenticate-use-case.ts
function makePrismaAuthenticateUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const authenticateUseCase = new AuthenticateUseCase(usersRepository);
  return authenticateUseCase;
}

// src/http/controller/authenticate.ts
var import_zod3 = require("zod");
async function authenticate(request, reply) {
  const authenticateBodySchema = import_zod3.z.object({
    email: import_zod3.z.string().email(),
    password: import_zod3.z.string().min(6).max(100)
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
    reply.status(500).send({ message: "Internal server error" });
    return;
  }
  reply.status(200).send();
}

// src/use-case/errors/resource-not-found-error.ts
var ResourceNotFoundError = class extends Error {
  constructor() {
    super("Resource not found");
  }
};

// src/use-case/get-user-profile.ts
var GetUserProfileUseCase = class {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }
  async execute({
    id
  }) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new ResourceNotFoundError();
    }
    return { user };
  }
};

// src/use-case/factotories/make-prisma-get-user-profile-use-case.ts
function makePrismaGetUserProfileUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const getUserProfileUseCase = new GetUserProfileUseCase(usersRepository);
  return getUserProfileUseCase;
}

// src/http/controller/get-user-profile.ts
var import_zod4 = require("zod");
async function getUserProfile(request, reply) {
  const getUserProfileBodySchema = import_zod4.z.object({
    id: import_zod4.z.string()
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
    reply.status(500).send({ message: "Internal server error" });
    return;
  }
}

// src/http/controller/health.ts
async function health(request, reply) {
  reply.status(200).send({ status: "ok" });
}

// src/http/routes.ts
async function appRoutes(app2) {
  app2.get("/health", health);
  app2.post("/users", register);
  app2.post("/sessions", authenticate);
  app2.get("/users/:id", getUserProfile);
}

// src/app.ts
var import_zod5 = require("zod");
var app = (0, import_fastify.default)();
app.register(appRoutes);
app.setErrorHandler((error, _request, reply) => {
  if (error instanceof import_zod5.ZodError) {
    return reply.status(400).send({ message: "Validation erros", issues: error.format() });
  }
  if (env.NODE_ENV !== "production") {
    console.log(error);
  } else {
  }
  return reply.status(500).send({ message: "Internal server error" });
});

// src/server.ts
app.listen({
  host: "0.0.0.0",
  port: env.PORT
}).then(() => {
  console.log(`\u{1F680} Server listening on: http://localhost:${env.PORT}`);
});
