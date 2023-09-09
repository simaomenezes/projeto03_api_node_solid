import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { ValidateCheckInUseCase } from './validate-check-in'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let checkInsRepository = new InMemoryCheckInsRepository()
let sut = new ValidateCheckInUseCase(checkInsRepository)

describe( 'Validate Check-in Use Case', () => {

    beforeEach(() => {
        checkInsRepository = new InMemoryCheckInsRepository()
        sut = new ValidateCheckInUseCase(checkInsRepository)

        //vi.useFakeTimers()
    })

    afterEach(() => {
       // vi.useRealTimers()
    })

    it('should be able to validate the check-in', async () => {

        const createdCheckIn = await checkInsRepository.create({
            gym_id: 'gym-1',
            user_id: 'user-1'
        })

        const { checkIn } = await sut.execute({
            checkInId: createdCheckIn.id,
        })

        expect(checkIn.created_at).toEqual(expect.any(Date))
        expect(checkInsRepository.items[0].validated_at).toEqual(expect.any(Date))
    })

    it('should not be able to validate an inexistent check-in', async () => {
       await expect(() => 
            sut.execute({
                checkInId: 'inexistent-check-in',
            }),
        ).rejects.toBeInstanceOf(ResourceNotFoundError)
    })
})