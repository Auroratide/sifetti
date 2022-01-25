export class NameTakenError extends Error {
    readonly name: string

    constructor(name: string) {
        super(`Profile Name "${name} is already taken`)
        this.name = name
    }
}
