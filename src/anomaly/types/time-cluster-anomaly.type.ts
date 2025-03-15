export type TimeClusterAnomaly = {
    clusterId: number
    windowStart: Date // start time of the previous window
    windowEnd: Date // end time of the current window
    change: number // difference in average ant presence between consecutive windows
    zScore: number
}
