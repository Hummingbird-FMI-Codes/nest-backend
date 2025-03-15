import { Injectable } from '@nestjs/common'
import { CreateAnimalDataDTO } from './DTOs/create-animal-data.dto'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class AnimalDataService {
    constructor(private readonly prismaService: PrismaService) {}

    async create(createDataDTO: CreateAnimalDataDTO) {
        const { specimenName, ...rest } = createDataDTO

        if (specimenName) {
            const existingSpecimen =
                await this.prismaService.specimen.findFirst({
                    where: {
                        name: specimenName
                    }
                })

            if (!existingSpecimen) {
                return this.prismaService.animalData.create({
                    data: {
                        ...rest,
                        specimen: {
                            create: {
                                name: specimenName
                            }
                        }
                    },
                    include: { specimen: true }
                })
            }

            return this.prismaService.animalData.create({
                data: {
                    ...rest,
                    specimen: {
                        connect: {
                            id: existingSpecimen.id
                        }
                    }
                },
                include: { specimen: true }
            })
        }

        return this.prismaService.animalData.create({
            data: rest,
            include: { specimen: true }
        })
    }

    findAll() {
        return this.prismaService.animalData.findMany({
            include: { specimen: true }
        })
    }

    findRange(startData: Date, endData: Date) {
        return this.prismaService.animalData.findMany({
            where: {
                timestamp: {
                    gte: startData,
                    lte: endData
                }
            },
            include: { specimen: true }
        })
    }
}
