export type ApiErrorInfo = {
    endpoint?: string,
    method?: string,
    status?: number,
    data?: any,
}

export class ApiError extends Error {
    readonly info: ApiErrorInfo

    constructor(message: string, info: ApiErrorInfo = {}) {
        super(message)

        this.info = info
    }
}
