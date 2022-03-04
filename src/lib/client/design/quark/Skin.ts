type SchemeParts = {
    Text: Skin.Color,
    Hover: Skin.Color,
}

const color = (name: string): Skin.Color => `var(--skin-${name})`

const scheme = (name: string, colors: SchemeParts): Skin.Scheme => ({
    ...colors,
    toString: () => color(name).toString(),
})


const Skin = {
    Sad: scheme('sad', {
        Text: color('sad-text'),
        Hover: color('sad-hover'),
    }),
    Joy: scheme('joy', {
        Text: color('joy-text'),
        Hover: color('joy-hover'),
    }),
    Anger: scheme('anger', {
        Text: color('anger-text'),
        Hover: color('anger-hover'),
    }),
    Fear: scheme('fear', {
        Text: color('fear-text'),
        Hover: color('fear-hover'),
    }),
    Disgust: scheme('disgust', {
        Text: color('disgust-text'),
        Hover: color('disgust-hover'),
    }),
    Neutral: scheme('neutral', {
        Text: color('neutral-text'),
        Hover: color('neutral-hover'),
    }),
    Content: scheme('content', {
        Text: color('content-text'),
        Hover: color('content-hover'),
    }),
}

module Skin {
    export type Color = {
        toString: () => string,
    }

    export type Scheme = Color & SchemeParts
}

export default Skin
