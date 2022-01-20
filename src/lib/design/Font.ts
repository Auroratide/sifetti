const size = (name: string): Font.Size => `var(--font-sz-${name})`

const Font = {
    Size: {
        Mercury: size('mercury'),
        Mars: size('mars'),
        Venus: size('venus'),
        Earth: size('earth'),
        Neptune: size('neptune'),
        Uranus: size('uranus'),
        Saturn: size('saturn'),
        Jupiter: size('jupiter'),
    }
}

module Font {
    export type Size = string
}

export default Font
