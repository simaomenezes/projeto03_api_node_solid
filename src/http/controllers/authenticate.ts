import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { AuthenticateUserCase } from '@/user-cases/authenticate'
import { InvalidCredentialsErro } from '@/user-cases/errors/invalid-credentials-error'

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
    const authenticateBodySchema = z.object({
        email: z.string().email(),
        password: z.string().min(6),
    })

    const { email, password } = authenticateBodySchema.parse(request.body)

    try {
        const usersRepository = new PrismaUsersRepository
        const authenticateUserCase = new AuthenticateUserCase(usersRepository)

        await authenticateUserCase.execute({
            email,
            password
        })   
    } catch (error) {
        if(error instanceof InvalidCredentialsErro) {
            return reply.status(400).send({
                message: error.message
            })
        }

        return error
    }

    return reply.status(200).send()
}