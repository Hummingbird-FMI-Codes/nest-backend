import { Injectable } from '@nestjs/common';
import { CreateDataDTO } from './DTOs/create-data.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DataService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createDataDTO: CreateDataDTO) {
    const { specimenName, ...rest } = createDataDTO;

    if (specimenName) {
      const existingSpecimen = await this.prismaService.specimen.findFirst({
        where: {
          name: specimenName,
        },
      });

      if (!existingSpecimen) {
        return this.prismaService.data.create({
          data: {
            ...rest,
            specimen: {
              create: {
                name: specimenName,
              },
            },
          },
          include: { specimen: true },
        });
      }

      return this.prismaService.data.create({
        data: {
          ...rest,
          specimen: {
            connect: {
              id: existingSpecimen.id,
            },
          },
        },
        include: { specimen: true },
      });
    }

    return this.prismaService.data.create({
      data: rest,
      include: { specimen: true },
    });
  }

  findAll() {
    return this.prismaService.data.findMany({
      include: { specimen: true },
    });
  }

  findRange(startData: Date, endData: Date) {
    return this.prismaService.data.findMany({
      where: {
        timestamp: {
          gte: startData,
          lte: endData,
        },
      },
      include: { specimen: true },
    });
  }
}
