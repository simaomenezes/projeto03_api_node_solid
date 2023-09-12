import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository"
import { GetUserProfileUserCase } from "../get-user-profile"

export function makeGetUserProfileUseCase() {
    const usersRepository = new PrismaUsersRepository
    const userCase = new GetUserProfileUserCase(usersRepository)

    return userCase
}