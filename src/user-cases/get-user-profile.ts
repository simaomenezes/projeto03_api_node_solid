import { UsersRepository } from "@/repositories/users-repository";
import { User } from "@prisma/client";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface GetUserProfileUserCaseRequest{
    userId: string
}

interface GetUserProfileUserCaseResponse{
    user: User
}


export class GetUserProfileUserCase {
    constructor(private usersRepository: UsersRepository){}

    async execute({
        userId
    }: GetUserProfileUserCaseRequest): Promise<GetUserProfileUserCaseResponse> {
        const user = await this.usersRepository.findById(userId)

        if(!user) {
            throw new ResourceNotFoundError()
        }
        return {
            user,
        }
    }
}