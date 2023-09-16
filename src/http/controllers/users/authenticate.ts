import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { InvalidCredentialsErro } from '@/user-cases/errors/invalid-credentials-error'
import { makeAuthenticateUseCase } from '@/user-cases/factories/make-authenticate-use-case'

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
    const authenticateBodySchema = z.object({
        email: z.string().email(),
        password: z.string().min(6),
    })

    const { email, password } = authenticateBodySchema.parse(request.body)
    let token = null
    let refreshToken = null

    try {
        const authenticateUserCase = makeAuthenticateUseCase()

        const { user } = await authenticateUserCase.execute({
            email,
            password,
        })

        token = await reply.jwtSign(
            {
                role: user.role,
            }, 
            {
                sign: {
                    sub: user.id
                },
            },
        )

        refreshToken = await reply.jwtSign(
            {
                role: user.role,
            }, 
            {
                sign: {
                    sub: user.id,
                    expiresIn: '7d',
                },
            },
        )
    } catch (error) {
        if(error instanceof InvalidCredentialsErro) {
            return reply.status(400).send({
                message: error.message
            })
        }

        return error
    }

    return reply
        .setCookie('refreshToken', refreshToken, {
            path: '/',
            secure: true,
            sameSite: true,
            httpOnly: true,            
        })
        .status(200).send({
            token,
        })
}