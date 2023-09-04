import { expect, describe, it, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUserCase } from './authenticate'
import { InvalidCredentialsErro } from './errors/invalid-credentials-error'

let usersRepository = new InMemoryUsersRepository()
let sut = new AuthenticateUserCase(usersRepository)

describe( 'Authenticate Use Case', () => {

    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository()
        sut = new AuthenticateUserCase(usersRepository)
    })

    it('should be able to Authenticate', async () => {
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
        expect(() => 
            sut.execute({
                email: 'jhonww@exemple.com',
                password: '123456'
            }),
        ).rejects.toBeInstanceOf(InvalidCredentialsErro)
    })

    it('should not be able to Authenticate with wrong password', async () => {
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