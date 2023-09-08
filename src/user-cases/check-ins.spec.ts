import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'
import { string } from 'zod'

let checkInsRepository = new InMemoryCheckInsRepository()
let sut = new CheckInUseCase(checkInsRepository)

describe( 'Check-in Use Case', () => {

    beforeEach(() => {
        checkInsRepository = new InMemoryCheckInsRepository()
        sut = new CheckInUseCase(checkInsRepository)

        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('should be able to check in', async () => {
        const { checkIn } = await sut.execute({
            gymId:'gymId',
            userId:'userId'
        })
        expect(checkIn.id).toEqual(expect.any(String))
    })

    it('should not be able to check in twice in the same day', async () => {
        vi.setSystemTime(new Date(2023, 0, 20, 8, 0, 0))
        await sut.execute({
            gymId:'gymId-01',
            userId:'userId-02'
        })

        await expect(() => sut.execute({
            gymId:'gymId-01',
            userId:'userId-02'
        })).rejects.toBeInstanceOf(Error)
    })

    it('should be able to check in twice but in different days', async () => {

        vi.setSystemTime(new Date(2023, 0, 20, 8, 0, 0))
        await sut.execute({
            gymId:'gymId-01',
            userId:'userId-02'
        })
        
        vi.setSystemTime(new Date(2023, 0, 21, 8, 0, 0))
        
        const { checkIn } = await sut.execute({
            gymId:'gymId-01',
            userId:'userId-02',
        })

        expect(checkIn.id).toEqual(expect.any(String))
    })
})