import { expect, describe, it, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { GetUserProfileUserCase } from './get-user-profile'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let usersRepository = new InMemoryUsersRepository()
let sut = new GetUserProfileUserCase(usersRepository)

describe( 'Get User Profile Use Case', () => {

    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository()
        sut = new GetUserProfileUserCase(usersRepository)
    })

    it('should be able to get user profile', async () => {
        const createdUser = await usersRepository.create({
            name: 'Jhon aux',
            email: 'jhonww@exemple.com',
            password_hash: await hash('123456', 6)
        })

        
        const { user } = await sut.execute({
            userId: createdUser.id
        })

        expect(user.name).toEqual('Jhon aux')
    })

    it('should not be able to get user profile with wrong user id', async () => {
        expect(() => 
            sut.execute({
                userId: 'non-existing-id'
            }),
        ).rejects.toBeInstanceOf(ResourceNotFoundError)
    })
})