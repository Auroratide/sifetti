import { suite } from 'uvu'
import { MemoryPeopleProvider } from '../../../../src/lib/people/provider/memory'

import { Context, withProvider } from './provider.spec'

const test = withProvider(
    suite<Context<MemoryPeopleProvider>>('Memory People Provider'),
    () => new MemoryPeopleProvider([])
)

test.run()
