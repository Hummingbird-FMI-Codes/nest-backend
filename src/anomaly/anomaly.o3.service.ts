import { Injectable } from '@nestjs/common'

import { AnimalData } from '@prisma/client'
import { haversineDistance } from 'src/utils/haversineDistance'
import { toGeoLocation } from 'src/utils/location'
import { ExtendedCluster } from './types/cluster.extended.type'
import { AntRecord } from './types/ant-record.type'

@Injectable()
export class AnomalyO3Service {
    analyzeAntData(
        data: AntRecord[],
        referenceData?: AntRecord[]
    ): { clusters: ExtendedCluster[]; anomalies: ExtendedCluster[] } {
        const clusters: ExtendedCluster[] = []

        // Group data by location (within 50 meters)
        for (const record of data) {
            let addedToCluster = false
            for (const cluster of clusters) {
                const distance = haversineDistance(
                    toGeoLocation(cluster.centroid.lat, cluster.centroid.lng),
                    toGeoLocation(record.lat, record.lng)
                )
                if (distance <= 50) {
                    // Add record to the cluster and update centroid
                    cluster.records.push(record)
                    const n = cluster.records.length
                    // Recalculate centroid as the mean of coordinates
                    cluster.centroid.lat =
                        (cluster.centroid.lat * (n - 1) + record.lat) / n
                    cluster.centroid.lng =
                        (cluster.centroid.lng * (n - 1) + record.lng) / n
                    addedToCluster = true
                    break
                }
            }
            if (!addedToCluster) {
                clusters.push({
                    records: [record],
                    centroid: { lat: record.lat, lng: record.lng },
                    averageAntPresence: 0 // Will be computed below
                })
            }
        }

        // Compute the average ant presence for each cluster
        clusters.forEach((cluster) => {
            const countAnts = cluster.records.reduce(
                (sum, rec) => sum + (rec.specimenId ? 1 : 0),
                0
            )
            cluster.averageAntPresence = countAnts / cluster.records.length
        })

        // Calculate baseline mean and standard deviation.
        // If referenceData is provided, use that; otherwise, compute from the clusters.
        let baselineMean: number
        let baselineStd: number
        if (referenceData && referenceData.length > 0) {
            const total = referenceData.reduce(
                (sum, rec) => sum + (rec.specimenId ? 1 : 0),
                0
            )
            baselineMean = total / referenceData.length
            // For a Bernoulli variable, standard deviation is sqrt(p*(1-p))
            baselineStd = Math.sqrt(baselineMean * (1 - baselineMean))
        } else {
            const averages = clusters.map((c) => c.averageAntPresence)
            baselineMean =
                averages.reduce((sum, avg) => sum + avg, 0) / averages.length
            const variance =
                averages.reduce(
                    (sum, avg) => sum + (avg - baselineMean) ** 2,
                    0
                ) / averages.length
            baselineStd = Math.sqrt(variance)
        }

        // Flag clusters as anomalies if their average ant presence deviates by more than 2 standard deviations
        const anomalies = clusters.filter((cluster) => {
            // Protect against division by zero
            const std = baselineStd || 1
            const zScore = (cluster.averageAntPresence - baselineMean) / std
            return Math.abs(zScore) > 2
        })

        return { clusters, anomalies }
    }
}
