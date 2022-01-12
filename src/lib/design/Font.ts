const size = (name: string): Font.Size => `var(--font-sz-${name})`

const Font = {
    Size: {
        Sm: size('sm'),
        Md: size('md'),
        Lg: size('lg'),
    }
}

module Font {
    export type Size = string
}

export default Font
