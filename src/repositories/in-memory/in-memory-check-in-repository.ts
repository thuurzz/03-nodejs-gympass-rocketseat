import { randomUUID } from "node:crypto";
import { Prisma, CheckIn } from "@prisma/client";
import { CheckInsRepository } from "../check-ins-repository";

export class InMemoryCheckInRepository implements CheckInsRepository {
  public items: CheckIn[] = [];

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
