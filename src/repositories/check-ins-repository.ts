import { CheckIn, Prisma } from "@prisma/client";

export interface CheckInsRepository {
  findById(checkInId: string): Promise<CheckIn | null>;
  countByUserId(userId: string): Promise<number>;
  findManyByUserId(
    userId: string,
    page: number
  ): Promise<CheckIn[] | null | undefined>;
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>;
  save(checkIn: CheckIn): Promise<CheckIn>;
  findByUserOnDate(
    userId: string,
    date: Date
  ): Promise<CheckIn | null | undefined>;
}
