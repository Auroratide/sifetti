import * as t from 'io-ts'
import { makeReporter } from '../api/validation'

const NonEmpty = t.brand(
    t.string,
    (n): n is t.Branded<string, { readonly NonEmpty: unique symbol }> => n.length > 0,
    'NonEmpty'
)

const FirstCharAlphanumeric = t.brand(
    NonEmpty,
    (n): n is t.Branded<t.TypeOf<typeof NonEmpty>, { readonly FirstCharAlphanumeric: unique symbol }> => /[a-zA-Z0-9]/.test(n[0]),
    'FirstCharAlphanumeric'
)

const AlphanumericWithSeparators = t.brand(
    t.string,
    (n): n is t.Branded<string, { readonly AlphanumericWithSeparators: unique symbol }> => /^[a-zA-Z0-9 _\-]*$/.test(n),
    'AlphanumericWithSeparators'
)

const MaxLength64 = t.brand(
    t.string,
    (n): n is t.Branded<string, { readonly MaxLength64: unique symbol }> => n.length <= 64,
    'MaxLength64'
)

const NonConsecutiveSpaces = t.brand(
    t.string,
    (n): n is t.Branded<string, { readonly NonConsecutiveSpaces: unique symbol }> => /^(?!.*  ).*$/.test(n),
    'NonConsecutiveSpaces'
)

const LastCharacterNonSpace = t.brand(
    t.string,
    (n): n is t.Branded<string, { readonly LastCharacterNonSpace: unique symbol }> => /^(?!.* $).*$/.test(n),
    'LastCharacterNonSpace'
)

export const ProfileName = t.intersection([
    FirstCharAlphanumeric,
    AlphanumericWithSeparators,
    MaxLength64,
    NonConsecutiveSpaces,
    LastCharacterNonSpace,
])

export type ProfileName = t.TypeOf<typeof ProfileName>

export const ProfileNameReporter = makeReporter([ {
    type: NonEmpty,
    message: 'Profile name cannot be empty.',
}, {
    type: FirstCharAlphanumeric,
    message: 'First letter of profile name must be alphanumeric.',
}, {
    type: AlphanumericWithSeparators,
    message: 'Profile name can only contain letters, numbers, spaces, and "_" or "-".',
}, {
    type: MaxLength64,
    message: 'Profile name must be less than 64 characters in length.',
}, {
    type: NonConsecutiveSpaces,
    message: 'Profile name cannot contain consecutive spaces.',
}, {
    type: LastCharacterNonSpace,
    message: 'Last character of profile name cannot be a space.',
} ])

export const sameName = (l?: ProfileName) => (r?: ProfileName) =>
    (l !== undefined || r !== undefined) && l?.toLowerCase() === r?.toLowerCase()
