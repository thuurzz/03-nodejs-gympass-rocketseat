import { UserRepository } from "@/repositories/users-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { CheckIn } from "@prisma/client";
import { CheckInsRepository } from "@/repositories/check-ins-repository";
import { GymsRepository } from "@/repositories/gyms-repository";
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinates";

interface CheckInUseCaseRequest {
  userId: string;
  gymId: string;
  userLatitude: number;
  userLongitude: number;
}

interface CheckInUseCaseResponse {
  checkIn: CheckIn;
}

export class CheckInUseCase {
  constructor(
    private readonly checkInRepository: CheckInsRepository,
    private readonly gymsRepository: GymsRepository
  ) {}

  async execute({
    gymId,
    userId,
    userLatitude,
    userLongitude,
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    const gym = await this.gymsRepository.findById(gymId);

    if (!gym) {
      throw new ResourceNotFoundError();
    }

    // Calculate distance between user and gym is less than 100 meters
    const distance = getDistanceBetweenCoordinates(
      {
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber(),
      },
      {
        latitude: userLatitude,
        longitude: userLongitude,
      }
    );

    const MAX_DISTANCE_IN_KILOMETERS = 0.1;

    if (distance > MAX_DISTANCE_IN_KILOMETERS) {
      throw new Error();
    }

    const checkInExistsOnSameDate =
      await this.checkInRepository.findByUserOnDate(userId, new Date());

    if (checkInExistsOnSameDate) {
      throw new Error();
    }

    const checkIn = await this.checkInRepository.create({
      gym_id: gymId,
      user_id: userId,
    });

    return { checkIn };
  }
}
