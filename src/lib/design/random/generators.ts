export interface RandomGenerator {
    next: () => number
}

class CyclicGenerator implements RandomGenerator {
    private numbers: number[]
    private i: number

    constructor(numbers: number[]) {
        this.numbers = numbers
        this.i = -1
    }

    next = () => this.numbers[++this.i % this.numbers.length]
}

export const cyclic = (numbers: number[]): RandomGenerator => new CyclicGenerator(numbers)

export const usingMath = () => ({
    next: () => Math.random(),
})
