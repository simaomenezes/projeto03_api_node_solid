import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'

let checkInsRepository = new InMemoryCheckInsRepository()
let sut = new CheckInUseCase(checkInsRepository)

describe( 'Check-in Use Case', () => {

    beforeEach(() => {
        checkInsRepository = new InMemoryCheckInsRepository()
        sut = new CheckInUseCase(checkInsRepository)
    })

    it('should be able to check in', async () => {
        const { checkIn } = await sut.execute({
            gymId:'gymId',
            userId:'userId'
        })

        expect(checkIn.id).toEqual(expect.any(String))
    })
})