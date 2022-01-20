type SchemeParts = {
    Text: Skin.Color,
}

const color = (name: string): Skin.Color => `var(--skin-${name})`

const scheme = (name: string, colors: SchemeParts): Skin.Scheme => ({
    ...colors,
    toString: () => color(name).toString(),
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
    Neutral: scheme('neutral', {
        Text: color('neutral-text'),
    }),
    Content: scheme('content', {
        Text: color('content-text'),
    }),
}

module Skin {
    export type Color = {
        toString: () => string,
    }

    export type Scheme = Color & SchemeParts
}

export default Skin
