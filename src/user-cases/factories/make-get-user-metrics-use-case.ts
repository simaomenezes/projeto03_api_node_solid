import { GetUserMetricsUseCase } from "../get-user-metrics"
import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository"

export function makeGetUserMetricUseCase() {
    const checkInsRepository = new PrismaCheckInsRepository()
    const userCase = new GetUserMetricsUseCase(checkInsRepository)

    return userCase
}