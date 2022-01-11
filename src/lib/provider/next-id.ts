export const nextId = <T>(items: T[], selector: (it: T) => string): string =>
    (1 + Math.max(0, ...items.map(n => Number(selector(n))).filter(n => !isNaN(n)))).toString()