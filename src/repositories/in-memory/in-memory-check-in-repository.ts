import { randomUUID } from "node:crypto";
import { Prisma, CheckIn } from "@prisma/client";
import { CheckInsRepository } from "../check-ins-repository";
import { GetResult } from "@prisma/client/runtime";

export class InMemoryCheckInRepository implements CheckInsRepository {
  public items: CheckIn[] = [];

  async findByUserOnDate(userId: string, date: Date) {
    const checkIn = this.items.find(
      (checkIn) =>
        checkIn.user_id === userId &&
        checkIn.created_at.toDateString() === date.toDateString()
    );

    if (!checkIn) {
      return null;
    }

    return checkIn;
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
}
