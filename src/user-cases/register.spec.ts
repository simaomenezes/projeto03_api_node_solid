import { expect, describe, it } from 'vitest'
import { RegisterUserCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

describe( 'Register Use Case', () => {

    it('should be able to register', async () => {
        const usersRepository = new InMemoryUsersRepository()
        const registerUseCase = new RegisterUserCase(usersRepository)

        const { user } = await registerUseCase.execute({
            name: 'Jhon aux',
            email: 'jhonww@exemple.com',
            password: '123456'
        })

        expect(user.id).toEqual(expect.any(String))
    })

    it('should hash user password upon registration', async () => {
        const usersRepository = new InMemoryUsersRepository()
        const registerUseCase = new RegisterUserCase(usersRepository)

        const { user } = await registerUseCase.execute({
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
        const usersRepository = new InMemoryUsersRepository()
        const registerUseCase = new RegisterUserCase(usersRepository)

        const email = 'jhonww@exemple.com'
        await registerUseCase.execute({
            name: 'Jhon aux',
            email,
            password: '123456'
        })

        expect(() =>
            registerUseCase.execute({
                name: 'Jhon aux1',
                email,
                password: '123456'
            }),
        ).rejects.toBeInstanceOf(UserAlreadyExistsError)
    })
})

