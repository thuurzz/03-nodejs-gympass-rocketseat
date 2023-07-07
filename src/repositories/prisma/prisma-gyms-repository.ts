import { Gym, Prisma } from "@prisma/client";
import { GetResult, Decimal } from "@prisma/client/runtime";
import { FindManyNearByParams, GymsRepository } from "../gyms-repository";
import { prisma } from "@/lib/prisma";

export class PrismaGymsRepository implements GymsRepository {
  async findManyNearby(params: FindManyNearByParams) {
    const DISTANCE_RADIUS = 10;
    const PAGE_LIMIT = 20;
    const gyms = await prisma.$queryRaw<Gym[]>`
      SELECT * FROM gyms
      WHERE ST_DWithin(
        ST_MakePoint(${params.longitude}, ${params.latitude})::geography,
        ST_MakePoint(gyms.longitude, gyms.latitude)::geography,
        ${DISTANCE_RADIUS}
      )
      LIMIT ${PAGE_LIMIT} 
      OFFSET ${(params.page - 1) * PAGE_LIMIT}
    `;
    return gyms;

    /**
     * QUERY RAW FROM ROCKETSEAT
        SELECT * from gyms
        WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
     */
  }

  async create(data: Prisma.GymCreateInput) {
    const gym = await prisma.gym.create({ data });
    return gym;
  }

  async findById(id: string) {
    const gym = await prisma.gym.findUnique({
      where: { id },
    });
    return gym;
  }

  async searchMany(query: string, page: number) {
    const gyms = await prisma.gym.findMany({
      where: {
        title: {
          contains: query,
        },
      },
      take: 20,
      skip: 20 * (page - 1),
    });
    return gyms;
  }
}
