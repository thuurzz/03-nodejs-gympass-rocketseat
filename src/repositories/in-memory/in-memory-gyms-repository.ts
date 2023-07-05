import { GymsRepository } from "../gyms-repository";
import { Gym } from "@prisma/client";

export class InMemoryGymsRepository implements GymsRepository {
  public gyms: Gym[] = [];

  async findById(id: string) {
    const gym = this.gyms.find((gym) => gym.id === id);
    return gym ? gym : null;
  }
}
