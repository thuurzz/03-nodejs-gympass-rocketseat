import { expect, describe, it, beforeEach, vi, afterEach } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-in-repository";
import { GetUserMetricsUseCase } from "./get-user-metrics";

let checkInsRepository: InMemoryCheckInsRepository;
let sut: GetUserMetricsUseCase;

describe("Get User Metrics Use Case", () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new GetUserMetricsUseCase(checkInsRepository);
  });

  it("should to be able to fetch check in history count", async () => {
    for (let i = 1; i <= 10; i++) {
      await checkInsRepository.create({
        user_id: "any_user_id",
        gym_id: "any_gym_id",
      });
    }
    const { checkInsCount } = await sut.execute({
      userId: "any_user_id",
    });

    expect(checkInsCount).toBe(10);
  });

  it("should to be able to fetch check in history count when don't exists", async () => {
    const { checkInsCount } = await sut.execute({
      userId: "any_user_id",
    });

    expect(checkInsCount).toBe(0);
  });
});
