import type { Reporter } from 'io-ts/lib/Reporter'
import type { Errors, Type, ValidationError } from 'io-ts'
import { fold } from 'fp-ts/lib/Either.js'

export type TypeErrorMessage<A> = {
    type: Type<A>,
    message: string,
}

const getErrorMessage = (types: TypeErrorMessage<any>[], defaultMessage: string) => (e: ValidationError) =>
    e.message !== undefined
        ? e.message
        : types.find(t => t.type.name === e.context[e.context.length - 1].type.name)?.message ?? defaultMessage
const reportErrors = (types: TypeErrorMessage<any>[], defaultMessage: string) => (e: Errors) => e.map(getErrorMessage(types, defaultMessage))
const reportSuccess = () => ['No errors!']

export const makeReporter = (types: TypeErrorMessage<any>[], defaultMessage: string = 'Input invalid for undisclosed reason'): Reporter<string[]> & { messages: TypeErrorMessage<any>[] } => ({
    report: fold(reportErrors(types, defaultMessage), reportSuccess),
    messages: types,
})
