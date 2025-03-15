import { AnimalData } from '@prisma/client'
import { PartialBy } from 'src/utils/partial-by'

export type AntRecord = PartialBy<AnimalData, 'id' | 'createdAt'>
