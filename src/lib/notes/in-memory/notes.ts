import { peopleInMemory } from '../../people/in-memory/people'

const borealis = `
## Facts

* Aurora Borealis occur in the northern hemisphere
* The lights are caused by interactions between the solar wind and Earth's magnetosphere
`

export const notesInMemory = {
    borealis: {
        id: '1',
        author: peopleInMemory.aurora.id,
        title: 'Borealis',
        content: borealis,
    },
    australis: {
        id: '2',
        author: peopleInMemory.aurora.id,
        title: 'Australis',
        content: 'These happen in the southern hemisphere.',
    },
}
