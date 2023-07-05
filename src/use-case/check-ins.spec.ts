import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryCheckInRepository } from "@/repositories/in-memory/in-memory-check-in-repository";
import { CheckInUseCase } from "./check-in";

let checkInRepository: InMemoryCheckInRepository;
let sut: CheckInUseCase;

describe("Check in Use Case", () => {
  beforeEach(() => {
    checkInRepository = new InMemoryCheckInRepository();
    sut = new CheckInUseCase(checkInRepository);
  });

  it("should to be able to do a check in", async () => {
    const checkInCreated = await checkInRepository.create({
      gym_id: "any_gym_id",
      user_id: "any_user_id",
    });

    const { checkIn } = await sut.execute({
      gymId: checkInCreated.gym_id,
      userId: checkInCreated.user_id,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });
});
