import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { expect, describe, it, beforeEach } from "vitest";
import { FetchNearbyGymsUseCase } from "./fetch-nearby-gyms";

let gymsRepository: InMemoryGymsRepository;
let sut: FetchNearbyGymsUseCase;

describe("Fetch Nearby Gyms Use Case", () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new FetchNearbyGymsUseCase(gymsRepository);
  });

  it("should to be able to search for gyms", async () => {
    await gymsRepository.create({
      title: "Near Gym",
      description: "Gym 1 description",
      latitude: -23.4258386,
      longitude: -46.5836981,
      phone: "123456789",
    });

    await gymsRepository.create({
      title: "Far Gym",
      description: "Gym 2 description",
      latitude: -23.5813034,
      longitude: -46.5577704,
      phone: "123456789",
    });

    const { gyms } = await sut.execute({
      userLatitude: -23.4258386,
      userLongitude: -46.5836981,
      page: 1,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([
      expect.objectContaining({
        title: "Near Gym",
      }),
    ]);
  });
});
