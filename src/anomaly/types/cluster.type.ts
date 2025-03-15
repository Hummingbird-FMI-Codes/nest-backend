import { AntRecord } from './ant-record.type'

export type Cluster = {
    records: AntRecord[]
    centroid: { lat: number; lng: number }
}
