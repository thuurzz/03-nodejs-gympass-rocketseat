import { expect, describe, it, beforeEach, vi, afterEach } from "vitest";
import { InMemoryCheckInRepository } from "@/repositories/in-memory/in-memory-check-in-repository";
import { CheckInUseCase } from "./check-in";

let checkInRepository: InMemoryCheckInRepository;
let sut: CheckInUseCase;

describe("Check in Use Case", () => {
  beforeEach(() => {
    checkInRepository = new InMemoryCheckInRepository();
    sut = new CheckInUseCase(checkInRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should to be able to do a check in", async () => {
    const { checkIn } = await sut.execute({
      gymId: "any_gym_id",
      userId: "any_user_id",
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not to be able to do more than one check in in the same day", async () => {
    vi.setSystemTime(new Date("2023-01-01 10:00:00"));

    await sut.execute({
      gymId: "any_gym_id",
      userId: "any_user_id",
    });

    await expect(() =>
      sut.execute({
        gymId: "any_gym_id",
        userId: "any_user_id",
      })
    ).rejects.toBeInstanceOf(Error);
  });

  it("should be able to check in twice but in different days", async () => {
    vi.setSystemTime(new Date("2023-01-01 10:00:00"));

    await sut.execute({
      gymId: "any_gym_id",
      userId: "any_user_id",
    });

    vi.setSystemTime(new Date("2023-03-02 10:00:00"));

    const checkInOnAnotherDay = await sut.execute({
      gymId: "any_gym_id",
      userId: "any_user_id",
    });

    expect(checkInOnAnotherDay.checkIn.id).toEqual(expect.any(String));
  });
});
