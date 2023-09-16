import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/user-cases/utils/create-and-authenticate-user'

describe('Search Gyms (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to list nearby gyms', async () => {
        const { token } = await createAndAuthenticateUser(app)

        await request(app.server)
        .post('/gyms')
        .set('Authorization', `Bearer ${token}`)
        .send({
            title: 'Near my gym-01',
            description: 'my gym test',
            phone: '123321213',
            latitude: -27.2092052,
            longitude: -49.6401091,
        })

        await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Far my gym-02',
                description: 'my gym test2',
                phone: '123321213',
                latitude: -27.0610928,
                longitude: -49.5229501,
        })

        const response = await request(app.server)
            .get('/gyms/nearby')
            .query({
                latitude: -27.2092052,
                longitude: -49.6401091,
            })
            .set('Authorization', `Bearer ${token}`)
            .send()

        expect(response.statusCode).toEqual(200)
        expect(response.body.gyms).toHaveLength(1)
        expect(response.body.gyms).toEqual([
            expect.objectContaining({
                title: 'Near my gym-01'
            })
        ])
    })
})