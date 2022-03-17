export class NameTakenError extends Error {
    readonly name: string

    constructor(name: string) {
        super(`Profile Name "${name}" is already taken`)
        this.name = name
    }
}

export class DuplicatePersonError extends Error {
    constructor(email: string) {
        super(`A person with email '${email}' already exists`);
    }
}

export class InvalidRefreshTokenError extends Error {
    constructor() {
        // Do not leak token (even if invalid) into message
        super('The refresh token provided could not be verified')
    }
}
