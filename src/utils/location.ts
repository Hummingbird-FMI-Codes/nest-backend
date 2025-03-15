export type GeoLocation = {
    lat: number
    lng: number
}

export const toGeoLocation = (lat: number, lng: number): GeoLocation => ({
    lat,
    lng
})
