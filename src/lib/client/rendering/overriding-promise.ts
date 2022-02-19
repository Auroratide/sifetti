export class OverridingPromiseBuilder<TRequestOut> {
    private initiator: () => Promise<TRequestOut>
    constructor(initiator: () => Promise<TRequestOut>) {
        this.initiator = initiator
    }

    then = <TResponse>(followup: (res: TRequestOut) => TResponse): OverridingPromise<TRequestOut, TResponse> => {
        return new OverridingPromise(this.initiator, followup)
    }
}

class OverridingPromise<TRequestOut, TResponse> {
    private initiator: () => Promise<TRequestOut>
    private followup: (res: TRequestOut) => TResponse
    private lastKey: Symbol

    constructor(initiator: () => Promise<TRequestOut>, followup: (res: TRequestOut) => TResponse) {
        this.initiator = initiator
        this.followup = followup
    }

    next = (): (() => Promise<TResponse>) => {
        const key = this.newKey()
        return () => this.initiator().then(res => {
            if (this.lastKey === key) {
                return this.followup(res)
            } else {
                return null
            }
        })
    }

    private newKey = () => {
        const key = Symbol()
        this.lastKey = key
        return key
    }
}

/**
 * If you update the UI based on an API request, but a second request goes out
 * before the first finishes, you could get a weird rendering issue where the
 * UI flashes from one result to the next, when the true state is that of the
 * last request. This is especially true when rendering optimistically (ie.
 * assuming the request will succeed and showing results based on that).
 * 
 * This utility only executes the `then` clause if it was the last such request.
 * This results in less flashing.
 * 
 * Call `next()` when the previous request should be invalidated, and then call
 * the returning function to actually initiate a request.
 */
export const useOverridingPromise = <T>(initiator: () => Promise<T>) =>
    new OverridingPromiseBuilder<T>(initiator)
