const color = (name: string): Skin.Color => `var(--skin-${name})`

const scheme = <T extends Record<string, Skin.Color>>(name: string, colors: T): Skin.Color & T => ({
    ...colors,
    toString: () => color(name),
})


const Skin = {
    Sad: scheme('sad', {
        Text: color('sad-text'),
    })
}

module Skin {
    export type Color = {
        toString: () => string,
    }
}

export default Skin
