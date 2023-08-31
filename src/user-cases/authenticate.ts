import { UsersRepository } from "@/repositories/users-repository";
import { InvalidCredentialsErro } from "./errors/invalid-credentials-error";
import { compare } from "bcryptjs";
import { User } from "@prisma/client";

interface AuthenticateUserCaseRequest{
    email: string,
    password: string
}

interface AuthenticateUserCaseResponse{
    user: User
}


export class AuthenticateUserCase {
    constructor(private usersRepository: UsersRepository){}

    async execute({
        email, 
        password,
    }: AuthenticateUserCaseRequest): Promise<AuthenticateUserCaseResponse> {
        const user = await this.usersRepository.findByEmail(email)

        if(!user) {
            throw new InvalidCredentialsErro()
        }

        const doesPasswordMatches = await compare(password, user.password_hash)
        
        if(!doesPasswordMatches) {
            throw new InvalidCredentialsErro()
        }
        return {
            user,
        }
    }
}