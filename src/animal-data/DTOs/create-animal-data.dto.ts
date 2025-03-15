import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateAnimalDataDTO {
    @IsDate()
    timestamp: Date

    @IsNumber()
    lat: number

    @IsNumber()
    lng: number

    @IsOptional()
    @IsString()
    specimenName?: string
}
