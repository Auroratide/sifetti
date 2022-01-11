export class TagsProviderError extends Error { }

export class DuplicateTagError extends TagsProviderError {
    readonly tagName: string

    constructor(tagName: string) {
        super(`Cannot create duplicate of tag "${tagName}"`)

        this.tagName = tagName
    }
}

export class EmptyTagError extends TagsProviderError {
    constructor() {
        super('Cannot create an empty tag')
    }
}
