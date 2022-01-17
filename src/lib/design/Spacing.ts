const staticSize = (name: string): Spacing.Size => `var(--sp-st-${name})`
const dynamicSize = (name: string): Spacing.Size => `var(--sp-dy-${name})`
const zeroingSize = (name: string): Spacing.Size => `var(--sp-ze-${name})`

const Spacing = {
    None: 'var(--sp-none)',
    Static: {
        Hydrogen: staticSize('h'),
        Helium: staticSize('he'),
        Berylium: staticSize('be'),
        Carbon: staticSize('c'),
        Oxygen: staticSize('o'),
        Neon: staticSize('ne'),
        Magnesium: staticSize('mg'),
    },
    Dynamic: {
        Hydrogen: dynamicSize('h'),
        Helium: dynamicSize('he'),
        Berylium: dynamicSize('be'),
        Carbon: dynamicSize('c'),
        Oxygen: dynamicSize('o'),
        Neon: dynamicSize('ne'),
        Magnesium: dynamicSize('mg'),
    },
    Zeroing: {
        Hydrogen: zeroingSize('h'),
        Helium: zeroingSize('he'),
        Berylium: zeroingSize('be'),
        Carbon: zeroingSize('c'),
        Oxygen: zeroingSize('o'),
        Neon: zeroingSize('ne'),
        Magnesium: zeroingSize('mg'),
    },
}

module Spacing {
    export type Size = string
}

export default Spacing
