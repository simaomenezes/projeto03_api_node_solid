import { expect, describe, it, beforeEach } from 'vitest'
import { RegisterUserCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

let usersRepository: InMemoryUsersRepository
let sut: RegisterUserCase

describe( 'Register Use Case', () => {

    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository()
        sut = new RegisterUserCase(usersRepository)
    })

    it('should be able to register', async () => {
        const { user } = await sut.execute({
            name: 'Jhon aux',
            email: 'jhonww@exemple.com',
            password: '123456'
        })

        expect(user.id).toEqual(expect.any(String))
    })

    it('should hash user password upon registration', async () => {
        const { user } = await sut.execute({
            name: 'Jhon aux',
            email: 'jhonww@exemple.com',
            password: '123456'
        })

        const isPasswordCorrectLyHashed = await compare(
            '123456',
            user.password_hash,
        )

        expect(isPasswordCorrectLyHashed).toBe(true)
    })

    it('should not be able to register with same email twice', async () => {
        const email = 'jhonww@exemple.com'
        await sut.execute({
            name: 'Jhon aux',
            email,
            password: '123456'
        })

        await expect(() =>
        sut.execute({
                name: 'Jhon aux1',
                email,
                password: '123456'
            }),
        ).rejects.toBeInstanceOf(UserAlreadyExistsError)
    })
})

