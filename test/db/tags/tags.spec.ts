import { suite } from 'uvu'
import * as assert from '../../assert'
import { withProvisioner, withTestAccounts } from '../db'
import type { TagTableRow } from './types'
import { buildTag } from './builder'
import { TAGS } from './name'
import { cleanTags } from './clean'

const id = (it: { id?: string }) => it.id

const test = withProvisioner(withTestAccounts(suite('DB Testing: Tags Table')))

test.before.each(async ({ provisioner, accounts }) => {
    await cleanTags(provisioner, accounts)
})

test('I can only read tags I have authored', async ({ provisioner, accounts }) => {
    const { data: tags } = await provisioner.exec(c => c.from<TagTableRow>(TAGS).insert([
        buildTag({ author_id: accounts.alpha.id, name: 't1' }),
        buildTag({ author_id: accounts.alpha.id, name: 't2' }),
        buildTag({ author_id: accounts.beta.id, name: 't1' }),
        buildTag({ author_id: accounts.beta.id, name: 't2' }),
    ]))
    const alphaTags = tags.filter(it => it.author_id === accounts.alpha.id)

    const { data: result } = await accounts.alpha.client.from<TagTableRow>(TAGS).select()
    assert.sameSet(result.map(id), alphaTags.map(id))
})

test('I can only insert tags for myself', async ({ accounts }) => {
    const { data } = await accounts.alpha.client.from<TagTableRow>(TAGS)
        .insert(buildTag({ author_id: accounts.alpha.id }))

    assert.equal(data.length, 1)

    const { error } = await accounts.alpha.client.from<TagTableRow>(TAGS)
        .insert(buildTag({ author_id: accounts.beta.id }))

    assert.ok(error, 'Inserting should have errored')
})

test('I can only update my own tags', async ({ provisioner, accounts }) => {
    const { data: notes } = await provisioner.exec(c => c.from<TagTableRow>(TAGS).insert([
        buildTag({ author_id: accounts.alpha.id }),
        buildTag({ author_id: accounts.beta.id }),
    ]))

    const alphaTag = notes.find(it => it.author_id === accounts.alpha.id)
    const betaTag = notes.find(it => it.author_id === accounts.beta.id)

    const { error: updateAlphaError } = await accounts.alpha.client.from<TagTableRow>(TAGS).update({
        name: 'new'
    }).eq('id', alphaTag.id)
    assert.not.ok(updateAlphaError, 'Update for alpha should not have errored')

    const { error: updateBetaError } = await accounts.alpha.client.from<TagTableRow>(TAGS).update({
        name: 'new'
    }).eq('id', betaTag.id)
    assert.ok(updateBetaError, 'Update for beta should have errored')
})

test('I can only delete my own tags', async ({ provisioner, accounts }) => {
    const { data: notes } = await provisioner.exec(c => c.from<TagTableRow>(TAGS).insert([
        buildTag({ author_id: accounts.alpha.id }),
        buildTag({ author_id: accounts.beta.id }),
    ]))

    const alphaTag = notes.find(it => it.author_id === accounts.alpha.id)
    const betaTag = notes.find(it => it.author_id === accounts.beta.id)

    const { data: alphaData } = await accounts.alpha.client.from<TagTableRow>(TAGS)
        .delete()
        .eq('id', alphaTag.id)
    assert.equal(alphaData.length, 1)

    const { data: betaData } = await accounts.alpha.client.from<TagTableRow>(TAGS)
        .delete()
        .eq('id', betaTag.id)
    assert.equal(betaData.length, 0)
})

test('tag character restrictions', async ({ accounts }) => {
    const shouldError = async (message: string, tag: string) => {
        const { error } = await accounts.alpha.client.from<TagTableRow>(TAGS)
            .insert(buildTag({
                author_id: accounts.alpha.id,
                name: tag,
            }))
        assert.ok(error, message)
    }

    await shouldError('Should not allow empty', '')
    await shouldError('Should not start with a space', ' a')
    await shouldError('Should not end with a space', 'a ')
    await shouldError('Should not contain consecutive spaces', 'a  a')
    await shouldError('Should not contain tabs', 'a\ta')
    await shouldError('Should not contain new lines', 'a\na')
    await shouldError('Should not contain carriage returns', 'a\ra')
})

test.run()