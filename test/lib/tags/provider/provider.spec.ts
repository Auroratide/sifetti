import type { Test } from 'uvu'
import * as assert from '../../../assert'
import type { TagsProvider } from '../../../../src/lib/tags/provider/provider'
import type { JwtToken } from '../../../../src/lib/security/jwt'

export const TestPeople = {
    Cay: {
        id: '1',
        email: 'cay@sifetti.com',
        password: 'patcher',
    },
    Antler: {
        id: '2',
        email: 'antler@sifetti.com',
        password: 'tracer',
    },
}

export type Context<T extends TagsProvider> = {
    provider: T,
    tokens: Record<keyof typeof TestPeople, JwtToken>,
}

export const withProvider = <T extends TagsProvider>(test: Test<Context<T>>, createProvider: () => T): Test<Context<T>> => {
    test.before.each((context) => {
        context.provider = createProvider()
    })

    test('getting all tags', async ({ provider, tokens }) => {
        await provider.create(tokens.Cay, 'location')
        let tags = await provider.getAll(tokens.Cay)
        
        assert.equal(tags.length, 1)
        assert.equal(tags[0].name, 'location')

        // Get only my tags
        await provider.create(tokens.Antler, 'character')
        tags = await provider.getAll(tokens.Antler)
        
        assert.equal(tags.length, 1)
        assert.equal(tags[0].name, 'character')
    })

    return test
}
