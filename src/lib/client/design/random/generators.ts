export interface RandomGenerator {
    next: () => number
}

/**
 * This seeded generator exists for the sake of hydrating the same random values
 * that were initially generated on the server. Otherwise, SvelteKit is rerunning
 * the random generator and replacing what was generated on the server with the 
 * client's value, resulting in a Flash of Changing Style.
 * 
 * See: https://auroratide.com/posts/server-side-rendering-a-random-number
 */
class SeededGenerator implements RandomGenerator {
    private random: () => number

    constructor(seed: string) {
        const seedGen = this.xmur3(seed)
        this.random = this.sfc32(seedGen(), seedGen(), seedGen(), seedGen())
    }

    next = () => this.random()

    // https://github.com/bryc/code/blob/master/jshash/PRNGs.md
    private sfc32(a: number, b: number, c: number, d: number) {
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
    private xmur3(str: string) {
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
