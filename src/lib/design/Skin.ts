const color = (name: string): Skin.Color => `var(--skin-${name})`

const scheme = <T extends Record<string, Skin.Color>>(name: string, colors: T): Skin.Color & T => ({
    ...colors,
    toString: () => color(name),
})


const Skin = {
    Sad: scheme('sad', {
        Text: color('sad-text'),
    }),
    Joy: scheme('joy', {
        Text: color('joy-text'),
    }),
    Anger: scheme('anger', {
        Text: color('anger-text'),
    }),
    Fear: scheme('fear', {
        Text: color('fear-text'),
    }),
    Disgust: scheme('disgust', {
        Text: color('disgust-text'),
    }),
}

module Skin {
    export type Color = {
        toString: () => string,
    }
}

export default Skin
