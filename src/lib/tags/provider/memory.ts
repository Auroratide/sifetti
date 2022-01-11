import type { PeopleProvider } from '../../people/provider/provider'
import type { Person } from '../../people/types'
import type { Tag } from '../types'
import type { TagsProvider } from './provider'
import type { JwtToken } from '../../security/jwt'
import { nextId } from '../../next-id'

export class MemoryTagsProvider implements TagsProvider {
    private people: PeopleProvider
    private db: Tag[]

    constructor(people: PeopleProvider, initial: Tag[] = []) {
        this.people = people
        this.db = initial
    }

    create = (token: JwtToken, name: string): Promise<string> =>
        this.withPerson(token, async person => {
            const newId = nextId(this.db, it => it.id)
            const newItem: Tag = {
                id: newId,
                author: person.id,
                name: name,
            }

            this.db.push(newItem)

            return newId
        })

    getAll = (token: JwtToken): Promise<Tag[]> =>
        this.withPerson(token, async person => {
            return this.db.filter(it => it.author === person.id)
        })

    private withPerson = <T>(token: JwtToken, fn: (person: Person) => Promise<T>): Promise<T> =>
        this.people.getByToken(token).then(fn)
}
