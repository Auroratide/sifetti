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

class SeededGenerator implements RandomGenerator {
    private seed: string
    private random: () => number

    constructor(seed: string) {
        this.seed = seed
        const seedGen = this.xmur3(seed)

        this.random = this.sfc32(seedGen(), seedGen(), seedGen(), seedGen())
    }

    next = () => this.random()

    // https://github.com/bryc/code/blob/master/jshash/PRNGs.md
    sfc32(a, b, c, d) {
        return function() {
            a |= 0; b |= 0; c |= 0; d |= 0
            var t = (a + b | 0) + d | 0
            d = d + 1 | 0
            a = b ^ b >>> 9
            b = c + (c << 3) | 0
            c = c << 21 | c >>> 11
            c = c + t | 0
            return (t >>> 0) / 4294967296
        }
    }

    // https://github.com/bryc/code/blob/master/jshash/PRNGs.md
    xmur3(str) {
        for(var i = 0, h = 1779033703 ^ str.length; i < str.length; i++)
            h = Math.imul(h ^ str.charCodeAt(i), 3432918353),
            h = h << 13 | h >>> 19;
        return function() {
            h = Math.imul(h ^ h >>> 16, 2246822507),
            h = Math.imul(h ^ h >>> 13, 3266489909);
            return (h ^= h >>> 16) >>> 0;
        }
    }
}

export const usingMath = () => ({
    next: () => Math.random(),
})

export const seeded = (seed: string): RandomGenerator => new SeededGenerator(seed)
