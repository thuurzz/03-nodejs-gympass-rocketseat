import { CheckIn, Prisma } from "@prisma/client";

export interface CheckInsRepository {
  countByUserId(userId: string): Promise<number>;
  findManyByUserId(
    userId: string,
    page: number
  ): Promise<CheckIn[] | null | undefined>;
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>;
  findByUserOnDate(
    userId: string,
    date: Date
  ): Promise<CheckIn | null | undefined>;
}
