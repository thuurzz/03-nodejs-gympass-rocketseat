import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { expect, describe, it, beforeEach } from "vitest";
import { CreateGymUseCase } from "./create-gym";

let gymsRepository: InMemoryGymsRepository;
let sut: CreateGymUseCase;

describe("Create Gym Use Case", () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new CreateGymUseCase(gymsRepository);
  });

  it("should to register", async () => {
    const { gym } = await sut.execute({
      id: "any_id",
      title: "Gym 1",
      description: "Gym 1 description",
      latitude: -23.4258386,
      longitude: -46.5836981,
      phone: "123456789",
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
