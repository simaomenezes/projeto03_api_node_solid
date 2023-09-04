import { expect, describe, it } from 'vitest'
import { compare, hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUserCase } from './authenticate'
import { InvalidCredentialsErro } from './errors/invalid-credentials-error'

describe( 'Authenticate Use Case', () => {

    it('should be able to Authenticate', async () => {
        const usersRepository = new InMemoryUsersRepository()
        const sut = new AuthenticateUserCase(usersRepository)

        await usersRepository.create({
            name: 'Jhon aux',
            email: 'jhonww@exemple.com',
            password_hash: await hash('123456', 6)
        })

        
        const { user } = await sut.execute({
            email: 'jhonww@exemple.com',
            password: '123456'
        })

        expect(user.id).toEqual(expect.any(String))
    })

    it('should not be able to Authenticate with wrong email', async () => {
        const usersRepository = new InMemoryUsersRepository()
        const sut = new AuthenticateUserCase(usersRepository)

        expect(() => 
            sut.execute({
                email: 'jhonww@exemple.com',
                password: '123456'
            }),
        ).rejects.toBeInstanceOf(InvalidCredentialsErro)
    })

    it('should not be able to Authenticate with wrong password', async () => {
        const usersRepository = new InMemoryUsersRepository()
        const sut = new AuthenticateUserCase(usersRepository)

        await usersRepository.create({
            name: 'Jhon aux',
            email: 'jhonww@exemple.com',
            password_hash: await hash('123456', 6)
        })

        expect(() => 
            sut.execute({
                email: 'jhonww@exemple.com',
                password: '123452'
            }),
        ).rejects.toBeInstanceOf(InvalidCredentialsErro)
    })
})

