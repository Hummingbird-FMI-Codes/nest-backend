import { Injectable } from '@nestjs/common'
import { AnimalData } from '@prisma/client'
import { AnimalDataService } from 'src/animal-data/animal-data.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { haversineDistance } from 'src/utils/haversineDistance'
import { mean } from 'src/utils/mean'
import { variance } from 'src/utils/variance'

type LocationStats = {
    mean: number
    stdDev: number
    occurrences: number
}

@Injectable()
export class AnomalyService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly animalDataService: AnimalDataService
    ) {}

    private groupByLocation(
        data: AnimalData[],
        thresholdKm: number = 0.05
    ): Map<string, number[]> {
        const locationMap = new Map<string, number[]>()

        for (const entry of data) {
            let foundKey = null
            for (const key of locationMap.keys()) {
                const [currLat, currLng] = key.split(',').map(Number)
                const distance = haversineDistance(
                    { lat: entry.lat, lng: entry.lng },
                    { lat: currLat, lng: currLng }
                )

                if (distance <= thresholdKm) {
                    foundKey = key
                    break
                }
            }

            if (!foundKey) {
                foundKey = `${entry.lat.toFixed(5)},${entry.lng.toFixed(5)}`
                locationMap.set(foundKey, [])
            }

            locationMap.get(foundKey).push(entry.specimenId ? 1 : 0)
        }
        return locationMap
    }

    private calculateStats(values: number[]): LocationStats {
        const dataMean = mean(values)
        const dataVariance = variance(values, dataMean)
        const dataStdDev = Math.sqrt(dataVariance)

        return {
            mean: dataMean,
            stdDev: dataStdDev,
            occurrences: values.length
        }
    }

    detectAnomalies(
        data: AnimalData[],
        analyzeFrom: Date,
        analyzeTo: Date,
        thresholdZScore: number = 3,
        distanceThresholdKm: number = 0.05
    ) {
        const sortedData = data.sort(
            (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
        )
        const actualData = sortedData.filter(
            (entry) =>
                entry.timestamp >= analyzeFrom && entry.timestamp <= analyzeTo
        )
        // const referenceData = sortedData.filter(
        //     (entry) => !actualData.includes(entry)
        // )

        const locationMap = this.groupByLocation(data, distanceThresholdKm)
        const anomalies: AnimalData[] = []

        for (const record of actualData) {
            let foundKey = null
            for (const key of locationMap.keys()) {
                const [lat, lng] = key.split(',').map(Number)
                if (
                    haversineDistance(
                        { lat, lng },
                        { lat: record.lat, lng: record.lng }
                    ) <= distanceThresholdKm
                ) {
                    foundKey = key
                    break
                }
            }

            if (!foundKey) continue
            console.log({ foundKey })
            const stats = this.calculateStats(locationMap.get(foundKey)!)
            const zScore =
                (record.specimenId ? 1 : -stats.mean) / (stats.stdDev || 1)

            console.log({ zScore, stats })
            if (Math.abs(zScore) > thresholdZScore) {
                anomalies.push(record)
            }
        }

        return anomalies
    }
}
