import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository"
import { ValidateCheckInUseCase } from "../validate-check-in"

export function makeValidateCheckInUseCase() {
    const checkInsRepository = new PrismaCheckInsRepository()
    const userCase = new ValidateCheckInUseCase(checkInsRepository)

    return userCase
}