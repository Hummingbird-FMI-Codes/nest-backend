export const mean = (values: number[]): number =>
    values.reduce((acc, curr) => acc + curr, 0) / values.length
