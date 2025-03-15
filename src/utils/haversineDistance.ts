import { degtorad } from './degtorad'
import { GeoLocation } from './location'

export const haversineDistance = (
    loc1: GeoLocation,
    loc2: GeoLocation
): number => {
    const R = 6371000 // Earth's radius in meters
    const dLat = degtorad(loc2.lat - loc1.lat)
    const dLon = degtorad(loc2.lng - loc1.lng)
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(degtorad(loc1.lat)) *
            Math.cos(degtorad(loc2.lat)) *
            Math.sin(dLon / 2) ** 2
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
}
