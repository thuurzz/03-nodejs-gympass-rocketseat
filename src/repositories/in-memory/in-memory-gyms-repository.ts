import { GetResult, Decimal } from "@prisma/client/runtime";
import { FindManyNearByParams, GymsRepository } from "../gyms-repository";
import { Gym, Prisma } from "@prisma/client";
import { randomUUID } from "crypto";
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinates";

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

  async searchMany(query: string, page: number) {
    const gyms = this.gyms
      .filter((gym) => gym.title.includes(query))
      .slice((page - 1) * 20, page * 20);
    return gyms;
  }

  async findManyNearby(params: FindManyNearByParams) {
    const DISTANCE_RADIUS = 10;
    return this.gyms
      .filter((gym) => {
        const distance = getDistanceBetweenCoordinates(
          {
            latitude: params.latitude,
            longitude: params.longitude,
          },
          {
            latitude: gym.latitude.toNumber(),
            longitude: gym.longitude.toNumber(),
          }
        );
        return distance <= DISTANCE_RADIUS;
      })
      .slice((params.page - 1) * 20, params.page * 20);
  }
}
