import * as t from 'io-ts'
import { makeReporter } from '../api/validation'

const NonEmpty = t.brand(
    t.string,
    (n): n is t.Branded<string, { readonly NonEmpty: unique symbol }> => n.length > 0,
    'NonEmpty'
)

const TerminalCharactersNotSpace = t.brand(
    t.string,
    (n): n is t.Branded<t.TypeOf<typeof NonEmpty>, { readonly TerminalCharactersNotSpace: unique symbol }> => /^[^\s](?!.* $).*$/.test(n),
    'TerminalCharactersNotSpace'
)

const NoTabsOrNewlines = t.brand(
    t.string,
    (n): n is t.Branded<t.TypeOf<typeof NonEmpty>, { readonly NoTabsOrNewlines: unique symbol }> => /^[^\t\n\r]+$/.test(n),
    'NoTabsOrNewlines'
)

const NonConsecutiveSpaces = t.brand(
    t.string,
    (n): n is t.Branded<string, { readonly NonConsecutiveSpaces: unique symbol }> => /^(?!.*  ).*$/.test(n),
    'NonConsecutiveSpaces'
)

export const TagName = t.intersection([
    NonEmpty,
    TerminalCharactersNotSpace,
    NoTabsOrNewlines,
    NonConsecutiveSpaces,
], 'TagName')

export type TagName = t.TypeOf<typeof TagName>

export const TagNameReporter = makeReporter([ {
    type: NonEmpty,
    message: 'Tag cannot be empty.',
}, {
    type: TerminalCharactersNotSpace,
    message: 'Tag cannot have a space as first or last character.',
}, {
    type: NoTabsOrNewlines,
    message: 'Tag cannot contain tabs or enters.',
}, {
    type: NonConsecutiveSpaces,
    message: 'Tag cannot contain consecutive spaces.',
} ], 'Invalid tag name.')
