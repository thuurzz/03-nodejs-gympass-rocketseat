import { randomUUID } from "node:crypto";
import { Prisma, CheckIn } from "@prisma/client";
import { CheckInsRepository } from "../check-ins-repository";
import dayjs from "dayjs";
import { GetResult } from "@prisma/client/runtime";

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public items: CheckIn[] = [];

  async findByUserOnDate(userId: string, date: Date) {
    const startOfDay = dayjs(date).startOf("date");
    const endOfDay = dayjs(date).endOf("date");

    const checkInOnSameDate = this.items.find((checkIn) => {
      const checkInDate = dayjs(checkIn.created_at);
      const isOnSameDate =
        checkInDate.isAfter(startOfDay) && checkInDate.isBefore(endOfDay);
      return checkIn.user_id === userId && isOnSameDate;
    });

    if (!checkInOnSameDate) {
      return null;
    }

    return checkInOnSameDate;
  }

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
      id: randomUUID(),
      ...data,
      created_at: new Date(),
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
    };
    this.items.push(checkIn);
    return checkIn;
  }

  async findManyByUserId(userId: string, page: number) {
    const checkIns = this.items
      .filter((checkIn) => checkIn.user_id === userId)
      .slice((page - 1) * 20, page * 20);
    return checkIns;
  }

  async countByUserId(userId: string) {
    const countCheckIns = this.items.filter(
      (checkIn) => checkIn.user_id === userId
    ).length;

    return countCheckIns;
  }

  async findById(checkInId: string) {
    const checkIn = this.items.find((checkIn) => checkIn.id === checkInId);

    if (!checkIn) {
      return null;
    }

    return checkIn;
  }

  async save(checkIn: CheckIn) {
    const index = this.items.findIndex((item) => item.id === checkIn.id);

    if (index >= 0) {
      this.items[index] = checkIn;
    }
    
    return checkIn;
  }
}
