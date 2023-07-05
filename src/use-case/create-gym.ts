import { GymsRepository } from "@/repositories/gyms-repository";
import { Gym } from "@prisma/client";

type CreateGymUseCaseParams = {
  id: string;
  title: string;
  description: string;
  phone: string;
  latitude: number;
  longitude: number;
};

interface CreateGymUseCaseResponse {
  gym: Gym;
}

export class CreateGymUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    description,
    phone,
    title,
    latitude,
    longitude,
  }: CreateGymUseCaseParams): Promise<CreateGymUseCaseResponse> {
    const gym = await this.gymsRepository.create({
      description,
      phone,
      latitude,
      longitude,
      title,
    });

    return { gym };
  }
}
