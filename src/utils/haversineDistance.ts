import { degtorad } from './degtorad'
import { GeoLocation } from './location'

export const haversineDistance = (
    loc1: GeoLocation,
    loc2: GeoLocation
): number => {
    const lat1Rad = degtorad(loc1.lat)
    const lng1Rad = degtorad(loc1.lng)
    const lat2Rad = degtorad(loc2.lat)
    const lng2Rad = degtorad(loc1.lng)

    const R = 6371 // Earth radius

    const dLat = lat2Rad - lat1Rad
    const dLng = lng2Rad - lng1Rad

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1Rad) *
            Math.cos(lat2Rad) *
            Math.sin(dLng / 2) *
            Math.sin(dLng / 2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c
}
