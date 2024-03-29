import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { UserAlreadyExistsError } from '@/user-cases/errors/user-already-exists-error'
import { makeRegisterUserCase } from '@/user-cases/factories/make-register-use-case'

export async function register(request: FastifyRequest, reply: FastifyReply) {
    const registerBodySchema = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6),
    })

    const { name, email, password } = registerBodySchema.parse(request.body)

    try {

        const registerUserCase = makeRegisterUserCase()

        await registerUserCase.execute({
            name,
            email,
            password
        })   
    } catch (error) {
        if(error instanceof UserAlreadyExistsError) {
            return reply.status(409).send({
                message: error.message
            })
        }

        return reply.status(500).send()// TOOD fix 
    }

    return reply.status(201).send()
}