const size = (name: string): Font.Size => `var(--font-sz-${name})`

const Font = {
    Size: {
        Mars: size('mars'),
        Venus: size('venus'),
        Earth: size('earth'),
        Neptune: size('neptune'),
        Uranus: size('uranus'),
        Saturn: size('saturn'),
        Jupiter: size('jupter'),
    }
}

module Font {
    export type Size = string
}

export default Font
