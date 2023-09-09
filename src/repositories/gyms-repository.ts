import { Gym, Prisma } from "@prisma/client";

export interface FindManyNearbyParams{
    latitude: number
    longitude: number
}

export interface GymsRepository {
    findById(id:string): Promise<Gym | null>
    create(data: Prisma.GymCreateInput): Promise<Gym | null>
    searchMany(query:string, page:number): Promise<Gym[]>
    searchManyNearby(params: FindManyNearbyParams): Promise<Gym[]>
}