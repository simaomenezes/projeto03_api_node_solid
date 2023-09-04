import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository"
import { RegisterUserCase } from "../register"

export function makeRegisterUserCase() {
    const usersRepository = new PrismaUsersRepository
    const registerUserCase = new RegisterUserCase(usersRepository)
    return registerUserCase
}