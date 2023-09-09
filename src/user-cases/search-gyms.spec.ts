import { expect, describe, it, beforeEach } from 'vitest'
import { SearchGymsUseCase } from './search-gyms'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

let gymsRepository = new InMemoryGymsRepository()
let sut = new SearchGymsUseCase(gymsRepository)

describe( 'Search Gyms Use Case', () => {

    beforeEach(() => {
        gymsRepository = new InMemoryGymsRepository()
        sut = new SearchGymsUseCase(gymsRepository)
    })

    it('should be able to search for gyms', async () => {

        await gymsRepository.create({
            title: 'JavaScript Gym',
            description: 'my gym test',
            phone: '123321213',
            latitude: -27.2092052,
            longitude: -49.6401091,
        })

        await gymsRepository.create({
            title: 'TypeScript Gym',
            description: 'my gym test',
            phone: '123321213',
            latitude: -27.2092052,
            longitude: -49.6401091,
        })

        const { gyms } = await sut.execute({
            query: 'JavaScript Gym',
            page: 1
        })

        expect(gyms).toHaveLength(1)
        expect(gyms).toEqual([
            expect.objectContaining({ title: 'JavaScript Gym' })
        ])
    })

    it('should be able to fetch paginated gyms search', async () => {

        for (let i = 1; i <= 22; i++) {
            await gymsRepository.create({
                title: `JavaScript Gym ${i}`,
                description: 'my gym test',
                phone: '123321213',
                latitude: -27.2092052,
                longitude: -49.6401091,
            })
        }

        const { gyms } = await sut.execute({
            query: 'JavaScript Gym',
            page: 2,
        })

        expect(gyms).toHaveLength(2)
        expect(gyms).toEqual([
            expect.objectContaining({ title: 'JavaScript Gym 21' }),
            expect.objectContaining({ title: 'JavaScript Gym 22' })
        ])
    })
})