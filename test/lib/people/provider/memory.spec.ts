import { suite } from 'uvu'
import { MemoryPeopleProvider } from '../../../../src/lib/shared/people/provider/memory'
import { sign } from '../../../../src/lib/server/jwt'

import { Context, withProvider } from './provider.spec'

const test = withProvider(
    suite<Context<MemoryPeopleProvider>>('Memory People Provider'),
    () => new MemoryPeopleProvider([], {}, sign)
)

test.run()
