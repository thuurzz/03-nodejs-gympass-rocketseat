import { expect, describe, it, beforeEach, vi, afterEach } from "vitest";
import { InMemoryCheckInRepository } from "@/repositories/in-memory/in-memory-check-in-repository";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { Gym } from "@prisma/client";
import { CheckInUseCase } from "./check-in";
import { Decimal } from "@prisma/client/runtime";

let checkInRepository: InMemoryCheckInRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe("Check in Use Case", () => {
  beforeEach(() => {
    checkInRepository = new InMemoryCheckInRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(checkInRepository, gymsRepository);

    const gym: Gym = {
      id: "any_gym_id",
      title: "FerruGym",
      description: "",
      phone: "",
      latitude: new Decimal(-23.4258386),
      longitude: new Decimal(-46.5836981),
    };
    gymsRepository.gyms.push(gym);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should to be able to do a check in", async () => {
    const { checkIn } = await sut.execute({
      gymId: "any_gym_id",
      userId: "any_user_id",
      userLatitude: -23.4258386,
      userLongitude: -46.5836981,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not to be able to do more than one check in in the same day", async () => {
    vi.setSystemTime(new Date("2023-01-01 10:00:00"));

    await sut.execute({
      gymId: "any_gym_id",
      userId: "any_user_id",
      userLatitude: -23.4258386,
      userLongitude: -46.5836981,
    });

    await expect(() =>
      sut.execute({
        gymId: "any_gym_id",
        userId: "any_user_id",
        userLatitude: -23.4258386,
        userLongitude: -46.5836981,
      })
    ).rejects.toBeInstanceOf(Error);
  });

  it("should be able to check in twice but in different days", async () => {
    vi.setSystemTime(new Date("2023-01-01 10:00:00"));

    await sut.execute({
      gymId: "any_gym_id",
      userId: "any_user_id",
      userLatitude: -23.4258386,
      userLongitude: -46.5836981,
    });

    vi.setSystemTime(new Date("2023-03-02 10:00:00"));

    const checkInOnAnotherDay = await sut.execute({
      gymId: "any_gym_id",
      userId: "any_user_id",
      userLatitude: -23.4258386,
      userLongitude: -46.5836981,
    });

    expect(checkInOnAnotherDay.checkIn.id).toEqual(expect.any(String));
  });

  it("should not to be able to do a check in a distant gym", async () => {
    gymsRepository.gyms.push({
      id: "another_gym_id",
      title: "Another Gym",
      description: "",
      phone: "",
      latitude: new Decimal(-23.5823113),
      longitude: new Decimal(-46.5542514),
    });

    await expect(() =>
      sut.execute({
        gymId: "another_gym_id",
        userId: "any_user_id",
        userLatitude: -23.4258386,
        userLongitude: -46.5836981,
      })
    ).rejects.toBeInstanceOf(Error);
  });
});
