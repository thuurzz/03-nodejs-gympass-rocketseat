import { expect, describe, it, beforeEach, vi, afterEach } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-in-repository";
import { FetchUserCheckInsHistoryUseCase } from "./fetch-user-check-ins-history";

let checkInsRepository: InMemoryCheckInsRepository;
let sut: FetchUserCheckInsHistoryUseCase;

describe("Fetch User Check in History Use Case", () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new FetchUserCheckInsHistoryUseCase(checkInsRepository);
  });

  it("should to be able to fetch check in history", async () => {
    await checkInsRepository.create({
      user_id: "any_user_id",
      gym_id: "any_gym_id",
    });

    await checkInsRepository.create({
      user_id: "any_user_id",
      gym_id: "any_gym_id_1",
    });

    const { checkIns } = await sut.execute({
      userId: "any_user_id",
      page: 1,
    });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({
        user_id: "any_user_id",
        gym_id: "any_gym_id",
      }),
      expect.objectContaining({
        user_id: "any_user_id",
        gym_id: "any_gym_id_1",
      }),
    ]);
  });

  it("should to be able to fetch check in paginated history", async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInsRepository.create({
        user_id: `any_user_id`,
        gym_id: `any_gym_${i}`,
      });
    }

    const { checkIns } = await sut.execute({
      userId: "any_user_id",
      page: 2,
    });

    expect(checkIns).toHaveLength(2);

    expect(checkIns).toEqual([
      expect.objectContaining({
        gym_id: "any_gym_21",
      }),
      expect.objectContaining({
        gym_id: "any_gym_22",
      }),
    ]);
  });
});
