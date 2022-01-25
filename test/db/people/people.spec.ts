import { suite } from 'uvu'
import * as assert from '../../assert'
import { withProvisioner, withTestAccounts } from '../db'
import type { PeopleTableRow } from './types'
import { PEOPLE } from './name'
import { config } from '../../config'

const test = withProvisioner(withTestAccounts(suite('DB Testing: People Table')))

// Purpose of prefix is to prevent collisions with real accounts
const makeUniqueName = (name: string) => `${config.testAccountPrefix}${name}`

test('profile information is publicly available', async ({ accounts }) => {
    const { data } = await accounts.alpha.client.from<PeopleTableRow>(PEOPLE)
        .select()
        .eq('id', accounts.beta.id)
        .single()

    assert.equal(data.id, accounts.beta.id)
})

test('I can only update my own profile', async ({ accounts }) => {
    const { data } = await accounts.alpha.client.from<PeopleTableRow>(PEOPLE)
        .update({
            unique_name: makeUniqueName('alpha'),
        })

    assert.equal(data.length, 1)
    assert.equal(data[0].unique_name, makeUniqueName('alpha'))
})

test('profile name restrictions', async ({ provisioner, accounts }) => {
    const attemptName = async (name: string, message: string) => {
        const { error } = await accounts.alpha.client.from<PeopleTableRow>(PEOPLE).update({
            unique_name: name,
        })
    
        assert.ok(error, message)    
    }
    
    await attemptName('', 'should not allow empty name')
    await attemptName(`_${makeUniqueName('')}`, 'should not allow non-alphanumeric first character')
    await attemptName(makeUniqueName('$'), 'should not allow special characters')
    await attemptName(makeUniqueName('1234567890123456789012345678901234567890123456789012345678901234567890'), 'should not allow names that are too long')
    await attemptName(makeUniqueName('j  j'), 'should not allow consecutive spaces')
    await attemptName(makeUniqueName(' '), 'should not allow last character as a space')
})

test('names must be unique case insensitively', async ({ accounts }) => {
    await accounts.alpha.client.from<PeopleTableRow>(PEOPLE).update({
        unique_name: makeUniqueName('alpha'),
    })

    const { error } = await accounts.beta.client.from<PeopleTableRow>(PEOPLE).update({
        unique_name: makeUniqueName('Alpha'),
    })

    assert.ok(error)
})

test('I can change the casing preference of my own name', async ({ accounts }) => {
    await accounts.alpha.client.from<PeopleTableRow>(PEOPLE).update({
        unique_name: makeUniqueName('alpha'),
    })

    const { data } = await accounts.alpha.client.from<PeopleTableRow>(PEOPLE).update({
        unique_name: makeUniqueName('Alpha'),
    }).single()

    assert.equal(data.unique_name, makeUniqueName('Alpha'))
})

test.run()