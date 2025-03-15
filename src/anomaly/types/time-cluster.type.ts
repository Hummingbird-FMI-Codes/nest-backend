import { TimeSeriesPoint } from './time-series-point.type'

export type TimeCluster = {
    clusterId: number
    centroid: { lat: number; lng: number }
    timeSeries: TimeSeriesPoint[]
}
