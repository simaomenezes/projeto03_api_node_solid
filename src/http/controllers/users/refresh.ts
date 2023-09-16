import { FastifyRequest, FastifyReply } from 'fastify'

export async function refresh(request: FastifyRequest, reply: FastifyReply) {

    await request.jwtVerify({ onlyCookie: true })

    let token = null
    let refreshToken = null
    token = await reply.jwtSign(
        {}, 
            {
                sign: {
                    sub: request.user.sub,
                },
            },
        )
    refreshToken = await reply.jwtSign(
        {}, 
            {
                sign: {
                    sub: request.user.sub,
                    expiresIn: '7d',
                },
            },
        )
    
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