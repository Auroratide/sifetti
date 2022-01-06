import { peopleInMemory } from '../../people/in-memory/people'

export const notesInMemory = {
    borealis: {
        id: '1',
        author: peopleInMemory.aurora.id,
        title: 'Borealis',
        content: 'These happen in the northern hemisphere.',
    },
    australis: {
        id: '2',
        author: peopleInMemory.aurora.id,
        title: 'Australis',
        content: 'These happen in the southern hemisphere.',
    },
}
