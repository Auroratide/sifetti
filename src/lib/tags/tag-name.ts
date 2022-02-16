import * as t from 'io-ts'

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
    TerminalCharactersNotSpace,
    NoTabsOrNewlines,
    NonConsecutiveSpaces,
])

export type TagName = t.TypeOf<typeof TagName>
