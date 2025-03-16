import { Injectable } from '@nestjs/common'
import { AnimalData } from '@prisma/client'
import { haversineDistance } from 'src/utils/haversineDistance'
import { toGeoLocation } from 'src/utils/location'
import { PartialBy } from 'src/utils/partial-by'
import { AntRecord } from './types/ant-record.type'
import { Cluster } from './types/cluster.type'
import { TimeSeriesPoint } from './types/time-series-point.type'
import { TimeCluster } from './types/time-cluster.type'
import { TimeClusterAnomaly } from './types/time-cluster-anomaly.type'
import { AnimalDataService } from 'src/animal-data/animal-data.service'

@Injectable()
export class AnomalyOverTimeService {
    async findAnomalyOverTime(startDate: Date, endDate: Date) {
        const data = await this.animalDataService.findRange(startDate, endDate)

        return this.analyzeAntDataOverTime(data, 60000)
    }

    constructor(private readonly animalDataService: AnimalDataService) {}
    /**
     * Groups ant records by spatial proximity (within 50 meters) into clusters.
     */
    private groupByLocation(
        data: AntRecord[],
        distanceThresholdKm = 50
    ): Cluster[] {
        const clusters: Cluster[] = []
        for (const record of data) {
            let added = false
            for (const cluster of clusters) {
                const distance = haversineDistance(
                    toGeoLocation(record.lat, record.lng),
                    toGeoLocation(cluster.centroid.lat, cluster.centroid.lng)
                )
                if (distance <= distanceThresholdKm) {
                    cluster.records.push(record)
                    const n = cluster.records.length
                    // Update centroid as the average of coordinates in the cluster.
                    cluster.centroid.lat =
                        (cluster.centroid.lat * (n - 1) + record.lat) / n
                    cluster.centroid.lng =
                        (cluster.centroid.lng * (n - 1) + record.lng) / n
                    added = true
                    break
                }
            }
            if (!added) {
                clusters.push({
                    records: [record],
                    centroid: { lat: record.lat, lng: record.lng }
                })
            }
        }
        return clusters
    }

    private createTimeSeries(
        records: AntRecord[],
        timeWindow: number
    ): TimeSeriesPoint[] {
        if (records.length === 0) return []
        // Sort records by timestamp.
        const sortedRecords = records
            .slice()
            .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
        const firstTime = sortedRecords[0].timestamp.getTime()
        const timeSeriesMap = new Map<number, AntRecord[]>()

        // Assign each record to a time window using floor division.
        for (const record of sortedRecords) {
            const timeKey = Math.floor(
                (record.timestamp.getTime() - firstTime) / timeWindow
            )
            if (!timeSeriesMap.has(timeKey)) {
                timeSeriesMap.set(timeKey, [])
            }
            timeSeriesMap.get(timeKey)!.push(record)
        }

        const timeSeries: TimeSeriesPoint[] = []
        const sortedKeys = Array.from(timeSeriesMap.keys()).sort(
            (a, b) => a - b
        )
        for (const key of sortedKeys) {
            const windowRecords = timeSeriesMap.get(key)!
            const windowStart = new Date(firstTime + key * timeWindow)
            const windowEnd = new Date(firstTime + (key + 1) * timeWindow)
            const count = windowRecords.length
            const antCount = windowRecords.reduce(
                (sum, r) => sum + (r.specimenId ? 1 : 0),
                0
            )
            const averageAntPresence = antCount / count
            timeSeries.push({
                windowStart,
                windowEnd,
                averageAntPresence,
                count
            })
        }
        return timeSeries
    }

    analyzeAntDataOverTime(
        data: AntRecord[],
        timeWindow: number,
        anomalyThreshold: number = 2,
        referenceData?: AntRecord[]
    ): { timeClusters: TimeCluster[]; anomalies: TimeClusterAnomaly[] } {
        // 1. Spatially group the data.
        const spatialClusters = this.groupByLocation(data)
        const timeClusters: TimeCluster[] = spatialClusters.map(
            (cluster, index) => ({
                clusterId: index,
                centroid: cluster.centroid,
                timeSeries: this.createTimeSeries(cluster.records, timeWindow)
            })
        )

        // 2. For each cluster, compute the change between consecutive time windows.
        type ChangeRecord = {
            clusterId: number
            windowStart: Date
            windowEnd: Date
            change: number
        }
        const changeRecords: ChangeRecord[] = []
        for (const timeCluster of timeClusters) {
            const series = timeCluster.timeSeries
            for (let i = 1; i < series.length; i++) {
                const change =
                    series[i].averageAntPresence -
                    series[i - 1].averageAntPresence
                changeRecords.push({
                    clusterId: timeCluster.clusterId,
                    windowStart: series[i - 1].windowStart,
                    windowEnd: series[i].windowEnd,
                    change
                })
            }
        }

        // 3. Compute baseline change statistics (mean and standard deviation).
        let baselineMean: number
        let baselineStd: number
        let allChanges: number[]

        if (referenceData && referenceData.length > 0) {
            // Process reference data similarly to compute its changes.
            const refClusters = this.groupByLocation(referenceData)
            const refChanges: number[] = []
            for (const cluster of refClusters) {
                const series = this.createTimeSeries(
                    cluster.records,
                    timeWindow
                )
                for (let i = 1; i < series.length; i++) {
                    refChanges.push(
                        series[i].averageAntPresence -
                            series[i - 1].averageAntPresence
                    )
                }
            }
            allChanges = refChanges
        } else {
            allChanges = changeRecords.map((r) => r.change)
        }

        if (allChanges.length === 0) {
            baselineMean = 0
            baselineStd = 0
        } else {
            baselineMean =
                allChanges.reduce((sum, val) => sum + val, 0) /
                allChanges.length
            const variance =
                allChanges.reduce(
                    (sum, val) => sum + Math.pow(val - baselineMean, 2),
                    0
                ) / allChanges.length
            baselineStd = Math.sqrt(variance)
        }

        // 4. Identify anomalies: any change with an absolute z‑score greater than the threshold.
        const anomalies: TimeClusterAnomaly[] = changeRecords
            .map((record) => {
                // Prevent division by zero.
                const std = baselineStd || 1
                const zScore = (record.change - baselineMean) / std
                return { ...record, zScore }
            })
            .filter((record) => Math.abs(record.zScore) > anomalyThreshold)

        return { timeClusters, anomalies }
    }
}
