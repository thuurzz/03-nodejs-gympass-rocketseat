import { Gym, Prisma } from "@prisma/client";

export interface FindManyNearByParams {
  latitude: number;
  longitude: number;
  page: number;
}

export interface GymsRepository {
  findManyNearby(params: FindManyNearByParams): Promise<Gym[]>;
  create(data: Prisma.GymCreateInput): Promise<Gym>;
  findById(id: string): Promise<Gym | null | undefined>;
  searchMany(query: string, page: number): Promise<Gym[]>;
}
