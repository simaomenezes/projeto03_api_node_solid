import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { ValidateCheckInUseCase } from './validate-check-in'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { LateCheckInValidationError } from './errors/late-check-in-validation-error'

let checkInsRepository = new InMemoryCheckInsRepository()
let sut = new ValidateCheckInUseCase(checkInsRepository)

describe( 'Validate Check-in Use Case', () => {

    beforeEach(() => {
        checkInsRepository = new InMemoryCheckInsRepository()
        sut = new ValidateCheckInUseCase(checkInsRepository)

        vi.useFakeTimers()
    })

    afterEach(() => {
       vi.useRealTimers()
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

    it('Should not be able to validate the check-in after 20 minutes of its creation', async () => {
        vi.setSystemTime(new Date(2023, 0, 1, 13, 40))

        const createdCheckIn = await checkInsRepository.create({
            gym_id: 'gym-1',
            user_id: 'user-1'
        })

        const twentyOneMinutesInMs = 1000 * 60 * 21

        vi.advanceTimersByTime(twentyOneMinutesInMs)

        await expect(() => 
            sut.execute({
                checkInId: createdCheckIn.id,
            }),
        ).rejects.toBeInstanceOf(LateCheckInValidationError)
    })
})