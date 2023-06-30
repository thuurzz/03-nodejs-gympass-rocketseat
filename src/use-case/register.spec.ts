import { expect, describe, it } from "vitest";
import { RegisterUseCase } from "./register";
import { compare } from "bcryptjs";

describe("Register Use Case", () => {
  it("should hash user password upon registration", async () => {
    const registerUseCase = new RegisterUseCase({
      async create(data) {
        return {
          id: "any_id",
          ...data,
          createdAt: new Date(),
        };
      },

      async findByEmail(email) {
        return null;
      },
    });

    const { user } = await registerUseCase.execute({
      name: "John Doe",
      email: "jhonDoe@gmail.com",
      password: "123456",
    });

    const isPasswordHashValid = await compare("123456", user.password_hash);

    expect(isPasswordHashValid).toBe(true);
  });
});
