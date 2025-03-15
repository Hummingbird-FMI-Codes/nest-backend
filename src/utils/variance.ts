export const variance = (values: number[], mean: number): number =>
    values.reduce((acc, curr) => acc + Math.pow(curr - mean, 2), 0) /
    values.length
