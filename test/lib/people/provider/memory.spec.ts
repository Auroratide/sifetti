import { suite } from 'uvu'
import { MemoryPeopleProvider } from '../../../../src/lib/people/provider/memory'
import { sign } from '../../../../src/lib/security/jwt'

import { Context, withProvider } from './provider.spec'

const test = withProvider(
    suite<Context<MemoryPeopleProvider>>('Memory People Provider'),
    () => new MemoryPeopleProvider([], {}, sign)
)

test.run()
