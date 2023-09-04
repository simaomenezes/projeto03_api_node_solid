import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository"
import { AuthenticateUserCase } from "../authenticate"

export function makeAuthenticateUseCase() {
    const usersRepository = new PrismaUsersRepository
    const authenticateUserCase = new AuthenticateUserCase(usersRepository)

    return authenticateUserCase
}