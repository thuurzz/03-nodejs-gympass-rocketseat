import { GetResult, Decimal } from "@prisma/client/runtime";
import { GymsRepository } from "../gyms-repository";
import { Gym, Prisma } from "@prisma/client";
import { randomUUID } from "crypto";

export class InMemoryGymsRepository implements GymsRepository {
  public gyms: Gym[] = [];

  async create(data: Prisma.GymCreateInput) {
    const gym: Gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Decimal(data.latitude.toString()),
      longitude: new Decimal(data.longitude.toString()),
    };

    this.gyms.push(gym);

    return gym;
  }

  async findById(id: string) {
    const gym = this.gyms.find((gym) => gym.id === id);
    return gym ? gym : null;
  }
}
