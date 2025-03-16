import { Controller, Get, Query } from '@nestjs/common'
import { AnimalData } from '@prisma/client'
import { AnomalyService } from './anomaly.service'
import { AnomalyO3Service } from './anomaly.o3.service'
import { AnomalyOverTimeService } from './anomaly.over-time.service'
import { AntRecord } from './types/ant-record.type'

@Controller('anomaly')
export class AnomalyController {
    constructor(
        private readonly anomalyService: AnomalyService,
        private readonly anomalyO3Service: AnomalyO3Service,
        private readonly anomalyOverTimeService: AnomalyOverTimeService
    ) {}

    @Get('test')
    test() {
        // const sampleData: AnimalData[] = Array.from(
        //     { length: 100 },
        //     (_, i) => ({
        //         lat: 40.7128 + (Math.random() * 0.01 - 0.005),
        //         lng: -74.006 + (Math.random() * 0.01 - 0.005),
        //         specimen
        //         timestamp: new Date(Date.now() - (100 - i) * 60000),
        //         id: i,
        //         createdAt: new Date()
        //     })
        // )
        // for (let i = 0; i < 10; i++) {
        //     sampleData.push({
        //         lat: 50,
        //         lng: 60,
        //         specimen
        //         timestamp: new Date(Date.now() - (100 - i) * 60000),
        //         id: i + 100,
        //         createdAt: new Date()
        //     })
        // }
        const sampleAntData: AntRecord[] = [
            // Cluster 1: around (37.7749, -122.4194)
            {
                timestamp: new Date('2025-03-14T10:00:00Z'),
                lat: 37.7749,
                lng: -122.4194,
                specimenId: 1
            },
            {
                timestamp: new Date('2025-03-14T10:05:00Z'),
                lat: 37.77495,
                lng: -122.41945,
                specimenId: 1
            },
            {
                timestamp: new Date('2025-03-14T10:10:00Z'),
                lat: 37.775,
                lng: -122.4195,
                specimenId: 1
            },

            // Cluster 2: around (37.7759, -122.4184)
            {
                timestamp: new Date('2025-03-14T11:00:00Z'),
                lat: 37.7759,
                lng: -122.4184,
                specimenId: 1
            },
            {
                timestamp: new Date('2025-03-14T11:05:00Z'),
                lat: 37.77595,
                lng: -122.41845,
                specimenId: 1
            },
            {
                timestamp: new Date('2025-03-14T11:10:00Z'),
                lat: 37.776,
                lng: -122.4185,
                specimenId: 1
            },

            // Cluster 3: around (37.7769, -122.4174)
            {
                timestamp: new Date('2025-03-14T12:00:00Z'),
                lat: 37.7769,
                lng: -122.4174,
                specimenId: 1
            },
            {
                timestamp: new Date('2025-03-14T12:05:00Z'),
                lat: 37.77695,
                lng: -122.41745,
                specimenId: 1
            },
            {
                timestamp: new Date('2025-03-14T12:10:00Z'),
                lat: 37.777,
                lng: -122.4175,
                specimenId: 1
            },

            // Cluster 4: around (37.7779, -122.4164)
            {
                timestamp: new Date('2025-03-14T13:00:00Z'),
                lat: 37.7779,
                lng: -122.4164,
                specimenId: 1
            },
            {
                timestamp: new Date('2025-03-14T13:05:00Z'),
                lat: 37.77795,
                lng: -122.41645,
                specimenId: 1
            },
            {
                timestamp: new Date('2025-03-14T13:10:00Z'),
                lat: 37.778,
                lng: -122.4165,
                specimenId: 1
            },

            // Cluster 5: around (37.7789, -122.4154)
            {
                timestamp: new Date('2025-03-14T14:00:00Z'),
                lat: 37.7789,
                lng: -122.4154,
                specimenId: 1
            },
            {
                timestamp: new Date('2025-03-14T14:05:00Z'),
                lat: 37.77895,
                lng: -122.41545,
                specimenId: 1
            },
            {
                timestamp: new Date('2025-03-14T14:10:00Z'),
                lat: 37.779,
                lng: -122.4155,
                specimenId: 1
            },

            // Cluster 6 (Anomalous): around (37.7850, -122.4210) with no ants detected.
            {
                timestamp: new Date('2025-03-14T15:00:00Z'),
                lat: 37.785,
                lng: -122.421,
                specimenId: null
            },
            {
                timestamp: new Date('2025-03-14T15:05:00Z'),
                lat: 37.78505,
                lng: -122.42105,
                specimenId: null
            },
            {
                timestamp: new Date('2025-03-14T15:10:00Z'),
                lat: 37.7851,
                lng: -122.4211,
                specimenId: null
            }
        ]

        return this.anomalyO3Service.analyzeAntData(sampleAntData)
    }

    @Get('testovertime')
    testOverTime() {
        const sampleData: AntRecord[] = [
            // ----- Cluster 1: around (37.7749, -122.4194) -----
            // Window 1: 10:00 - 10:59 (Stable: 100% ant presence)
            {
                timestamp: new Date('2025-03-14T10:00:00Z'),
                lat: 37.7749,
                lng: -122.4194,
                specimenId: 1
            },
            {
                timestamp: new Date('2025-03-14T10:15:00Z'),
                lat: 37.7749,
                lng: -122.4194,
                specimenId: 1
            },
            {
                timestamp: new Date('2025-03-14T10:30:00Z'),
                lat: 37.7749,
                lng: -122.4194,
                specimenId: 1
            },

            // Window 2: 11:00 - 11:59 (Stable: 100% ant presence)
            {
                timestamp: new Date('2025-03-14T11:00:00Z'),
                lat: 37.77495,
                lng: -122.41945,
                specimenId: 1
            },
            {
                timestamp: new Date('2025-03-14T11:15:00Z'),
                lat: 37.77495,
                lng: -122.41945,
                specimenId: 1
            },
            {
                timestamp: new Date('2025-03-14T11:30:00Z'),
                lat: 37.77495,
                lng: -122.41945,
                specimenId: 1
            },

            // Window 3: 12:00 - 12:59 (Anomaly: sudden drop to 0% ant presence)
            {
                timestamp: new Date('2025-03-14T12:00:00Z'),
                lat: 37.775,
                lng: -122.4195,
                specimenId: null
            },
            {
                timestamp: new Date('2025-03-14T12:15:00Z'),
                lat: 37.775,
                lng: -122.4195,
                specimenId: null
            },
            {
                timestamp: new Date('2025-03-14T12:30:00Z'),
                lat: 37.775,
                lng: -122.4195,
                specimenId: null
            },

            // ----- Cluster 2: around (37.7849, -122.4294) -----
            // Window 1: 10:00 - 10:59 (Stable: 100% ant presence)
            {
                timestamp: new Date('2025-03-14T10:05:00Z'),
                lat: 37.7849,
                lng: -122.4294,
                specimenId: 1
            },
            {
                timestamp: new Date('2025-03-14T10:20:00Z'),
                lat: 37.7849,
                lng: -122.4294,
                specimenId: 1
            },
            {
                timestamp: new Date('2025-03-14T10:40:00Z'),
                lat: 37.7849,
                lng: -122.4294,
                specimenId: 1
            },

            // Window 2: 11:00 - 11:59 (Stable: 100% ant presence)
            {
                timestamp: new Date('2025-03-14T11:05:00Z'),
                lat: 37.78495,
                lng: -122.42945,
                specimenId: 1
            },
            {
                timestamp: new Date('2025-03-14T11:20:00Z'),
                lat: 37.78495,
                lng: -122.42945,
                specimenId: 1
            },
            {
                timestamp: new Date('2025-03-14T11:40:00Z'),
                lat: 37.78495,
                lng: -122.42945,
                specimenId: 1
            },

            // Window 3: 12:00 - 12:59 (Stable: 100% ant presence)
            {
                timestamp: new Date('2025-03-14T12:05:00Z'),
                lat: 37.785,
                lng: -122.4295,
                specimenId: 1
            },
            {
                timestamp: new Date('2025-03-14T12:20:00Z'),
                lat: 37.785,
                lng: -122.4295,
                specimenId: 1
            },
            {
                timestamp: new Date('2025-03-14T12:40:00Z'),
                lat: 37.785,
                lng: -122.4295,
                specimenId: 1
            }
        ]

        return this.anomalyOverTimeService.analyzeAntDataOverTime(
            sampleData,
            3600000, // 1 hour
            1.5
        )
    }

    @Get('clustered')
    findAnomaly(
        @Query('startDate') startDate: Date,
        @Query('endDate') endDate
    ) {
        return this.anomalyO3Service.findAnomalyClustered(startDate, endDate)
    }

    @Get('overtime')
    findAnomalyOverTime(
        @Query('startDate') startDate: Date,
        @Query('endDate') endDate: Date
    ) {
        return this.anomalyOverTimeService.findAnomalyOverTime(
            startDate,
            endDate
        )
    }
}
