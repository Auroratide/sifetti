/// <reference types="@sveltejs/kit" />
/// <reference types="./lib/people/types" />

declare namespace App {
    interface Locals {
        accessToken?: string,
        refreshToken?: string,
        tokenExpiry?: Date,
    }

    interface Session {
        person?: Person,
        demoFetch?: (input: RequestInfo, init?: RequestInit) =>Promise<Response>,
    }
}
