import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { expect, describe, it, beforeEach, vi, afterEach } from "vitest";
import { SearchGymsUseCase } from "./search-gyms";

let gymsRepository: InMemoryGymsRepository;
let sut: SearchGymsUseCase;

describe("Search Gyms Use Case", () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new SearchGymsUseCase(gymsRepository);
  });

  it("should to be able to search for gyms", async () => {
    await gymsRepository.create({
      title: "Gym 1",
      description: "Gym 1 description",
      latitude: -23.4258386,
      longitude: -46.5836981,
      phone: "123456789",
    });

    await gymsRepository.create({
      title: "Gym 2",
      description: "Gym 2 description",
      latitude: -23.4258386,
      longitude: -46.5836981,
      phone: "123456789",
    });

    const { gyms } = await sut.execute({
      query: "Gym 1",
      page: 1,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([
      expect.objectContaining({
        title: "Gym 1",
        description: "Gym 1 description",
      }),
    ]);
  });

  it("should to be able to fetch paginated gym search", async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `Gym ${i}`,
        description: `Gym ${i} description`,
        latitude: -23.4258386,
        longitude: -46.5836981,
        phone: "123456789",
      });
    }

    const { gyms } = await sut.execute({
      query: "Gym",
      page: 2,
    });

    expect(gyms).toHaveLength(2);

    expect(gyms).toEqual([
      expect.objectContaining({
        title: `Gym 21`,
      }),
      expect.objectContaining({
        title: `Gym 22`,
      }),
    ]);
  });
});
