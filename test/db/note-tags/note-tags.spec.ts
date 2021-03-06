import { suite } from 'uvu'
import * as assert from '../../assert'
import { withProvisioner, withTestAccounts } from '../db'
import type { NoteTableRow } from '../notes/types'
import { cleanNotes } from '../notes/clean'
import { buildNote } from '../notes/builder'
import type { TagTableRow } from '../tags/types'
import { cleanTags } from '../tags/clean'
import { buildTag } from '../tags/builder'
import type { NoteTagTableRow } from './types'
import { buildNoteTag } from './builder'
import { NOTES } from '../notes/name'
import { TAGS } from '../tags/name'
import { NOTE_TAGS } from './name'

const test = withProvisioner(withTestAccounts(suite('DB Testing: Note-Tags Table')))

test.before.each(async ({ provisioner, accounts}) => {
    await cleanTags(provisioner, accounts)
    await cleanNotes(provisioner, accounts)
})

test('I can only read note-tags I have authored', async ({ provisioner, accounts }) => {
    const { data: [ alphaNote, betaNote ] } = await provisioner.exec(c => c.from<NoteTableRow>(NOTES).insert([
        buildNote({ user_id: accounts.alpha.id }),
        buildNote({ user_id: accounts.beta.id }),
    ]))
    const { data: [ alphaTag, betaTag ] } = await provisioner.exec(c => c.from<TagTableRow>(TAGS).insert([
        buildTag({ author_id: accounts.alpha.id }),
        buildTag({ author_id: accounts.beta.id }),
    ]))

    await provisioner.exec(c => c.from<NoteTagTableRow>(NOTE_TAGS).insert([
        buildNoteTag({ note_id: alphaNote.id, tag_id: alphaTag.id }),
        buildNoteTag({ note_id: betaNote.id, tag_id: betaTag.id }),
    ]))

    const { data: result } = await accounts.alpha.client.from<NoteTagTableRow>(NOTE_TAGS).select()
    assert.sameSet(result.map(it => it.note_id), [alphaNote.id])
})

test('I can only associate notes I\'ve made with tags I\'ve made', async ({ provisioner, accounts }) => {
    const { data: [ alphaNote, betaNote ] } = await provisioner.exec(c => c.from<NoteTableRow>(NOTES).insert([
        buildNote({ user_id: accounts.alpha.id }),
        buildNote({ user_id: accounts.beta.id }),
    ]))
    const { data: [ alphaTag, betaTag ] } = await provisioner.exec(c => c.from<TagTableRow>(TAGS).insert([
        buildTag({ author_id: accounts.alpha.id }),
        buildTag({ author_id: accounts.beta.id }),
    ]))

    const { data } = await accounts.alpha.client.from<NoteTagTableRow>(NOTE_TAGS).insert(buildNoteTag({
        note_id: alphaNote.id, tag_id: alphaTag.id,
    }))
    assert.ok(data, 'Note tag should have been inserted')

    const { error: notMyTagError } = await accounts.alpha.client.from<NoteTagTableRow>(NOTE_TAGS).insert(buildNoteTag({
        note_id: alphaNote.id, tag_id: betaTag.id,
    }))
    assert.ok(notMyTagError, 'Note tag should not have been inserted because tag belongs to beta')

    const { error: notMyNoteError } = await accounts.alpha.client.from<NoteTagTableRow>(NOTE_TAGS).insert(buildNoteTag({
        note_id: betaNote.id, tag_id: alphaTag.id,
    }))
    assert.ok(notMyNoteError, 'Note tag should not have been inserted because note belongs to beta')
})

test('I can only delete my note-tags', async ({ provisioner, accounts }) => {
    const { data: [ alphaNote, betaNote ] } = await provisioner.exec(c => c.from<NoteTableRow>(NOTES).insert([
        buildNote({ user_id: accounts.alpha.id }),
        buildNote({ user_id: accounts.beta.id }),
    ]))
    const { data: [ alphaTag, betaTag ] } = await provisioner.exec(c => c.from<TagTableRow>(TAGS).insert([
        buildTag({ author_id: accounts.alpha.id }),
        buildTag({ author_id: accounts.beta.id }),
    ]))

    await provisioner.exec(c => c.from<NoteTagTableRow>(NOTE_TAGS).insert([
        buildNoteTag({ note_id: alphaNote.id, tag_id: alphaTag.id }),
        buildNoteTag({ note_id: betaNote.id, tag_id: betaTag.id }),
    ]))

    const { data: alphaData } = await accounts.alpha.client.from<NoteTagTableRow>(NOTE_TAGS)
        .delete()
        .eq('note_id', alphaNote.id)
    assert.equal(alphaData.length, 1)

    const { data: betaData } = await accounts.alpha.client.from<NoteTagTableRow>(NOTE_TAGS)
        .delete()
        .eq('note_id', betaNote.id)
    assert.equal(betaData.length, 0)
})

test.run()