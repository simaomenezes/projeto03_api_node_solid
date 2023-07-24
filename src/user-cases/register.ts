import { hash } from 'bcryptjs'
import { UsersRepository } from '@/repositories/users-repository';

interface RegisterUserCaseRequest {
    name: string;
    email: string;
    password: string;
}

export class RegisterUserCase {

    constructor(private userRepository: UsersRepository) {}
    async execute({name, email, password}:RegisterUserCaseRequest) {
        const password_hash = await hash(password, 6)
    
        const userWithSameEmail = await this.userRepository.findByEmail(email)
    
        if(userWithSameEmail) {
            throw new Error('E-mail already exists.')
        }

        await this.userRepository.create({
            name, 
            email,
            password_hash,
        })
    }
}
