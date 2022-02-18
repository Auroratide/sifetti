import { suite } from 'uvu'
import * as assert from '../../assert'
import { withProvisioner, withTestAccounts } from '../db'
import type { NoteTableRow } from './types'
import { buildNote } from './builder'
import { NOTES } from './name'
import { cleanNotes } from './clean'
import { cleanTags } from '../tags/clean'

const id = (it: { id?: string }) => it.id

const test = withProvisioner(withTestAccounts(suite('DB Testing: Notes Table')))

test('I can only read notes I have authored', async ({ provisioner, accounts }) => {
    await cleanTags(provisioner, accounts)
    await cleanNotes(provisioner, accounts)

    const { data: notes } = await provisioner.exec(c => c.from<NoteTableRow>(NOTES).insert([
        buildNote({ user_id: accounts.alpha.id }),
        buildNote({ user_id: accounts.alpha.id }),
        buildNote({ user_id: accounts.beta.id }),
        buildNote({ user_id: accounts.beta.id }),
    ]))
    const alphaNotes = notes.filter(it => it.user_id === accounts.alpha.id)

    const { data: result } = await accounts.alpha.client.from<NoteTableRow>(NOTES).select()
    assert.sameSet(result.map(id), alphaNotes.map(id))
})

test('I can only insert notes for myself', async ({ accounts }) => {
    const { data } = await accounts.alpha.client.from<NoteTableRow>(NOTES)
        .insert(buildNote({ user_id: accounts.alpha.id }))

    assert.equal(data.length, 1)

    const { error } = await accounts.alpha.client.from<NoteTableRow>(NOTES)
        .insert(buildNote({ user_id: accounts.beta.id }))

    assert.ok(error, 'Inserting should have errored')
})

test('I can only update my own notes', async ({ provisioner, accounts }) => {
    const { data: notes } = await provisioner.exec(c => c.from<NoteTableRow>(NOTES).insert([
        buildNote({ user_id: accounts.alpha.id }),
        buildNote({ user_id: accounts.beta.id }),
    ]))

    const alphaNote = notes.find(it => it.user_id === accounts.alpha.id)
    const betaNote = notes.find(it => it.user_id === accounts.beta.id)

    const { error: updateAlphaError } = await accounts.alpha.client.from<NoteTableRow>(NOTES).update({
        title: 'new'
    }).eq('id', alphaNote.id)
    assert.not.ok(updateAlphaError, 'Update for alpha should not have errored')

    const { error: updateBetaError } = await accounts.alpha.client.from<NoteTableRow>(NOTES).update({
        title: 'new'
    }).eq('id', betaNote.id)
    assert.ok(updateBetaError, 'Update for beta should have errored')
})

test('I can only delete my own notes', async ({ provisioner, accounts }) => {
    const { data: notes } = await provisioner.exec(c => c.from<NoteTableRow>(NOTES).insert([
        buildNote({ user_id: accounts.alpha.id }),
        buildNote({ user_id: accounts.beta.id }),
    ]))

    const alphaNote = notes.find(it => it.user_id === accounts.alpha.id)
    const betaNote = notes.find(it => it.user_id === accounts.beta.id)

    const { data: alphaData } = await accounts.alpha.client.from<NoteTableRow>(NOTES)
        .delete()
        .eq('id', alphaNote.id)
    assert.equal(alphaData.length, 1)

    const { data: betaData } = await accounts.alpha.client.from<NoteTableRow>(NOTES)
        .delete()
        .eq('id', betaNote.id)
    assert.equal(betaData.length, 0)
})


test.run()