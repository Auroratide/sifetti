import { peopleInMemory } from '../../people/in-memory/people'

// The purpose of this is to present many kinds of markdown possibilities.
// But of course, we must be thematic
const borealis = `## Fast Facts

* Aurora Borealis occur in the northern hemisphere
  * [Aurora _Australis_](/notes/2), on the other hand, occurs in the southern hemisphere
* The lights are caused by interactions between the solar wind and Earth's magnetosphere

## STEVE

Sometimes, instead of red and green ribbons of light, you can see streaks of purple light moving across the sky. Although these have been observed for years, they weren't named until 2016.

<abbr title="Strong Thermal Emission Velocity Enhancement">STEVE</abbr> stands for **Strong Thermal Emission Velocity Enhancement**. Technically, although these things appear at the same time as aurora, there are not, in fact, aurora. Aurora occurs when charged particles fall into the atmosphere, but such particles do not generally accompany STEVE.

STEVE is therefore still an atmospheric mystery.

## Some Quotes

> Both <mark>Jupiter and Saturn</mark> have magnetic fields that are stronger than Earth's (Jupiter's equatorial field strength is 4.3 Gauss, compared to 0.3 Gauss for Earth), and both have extensive radiation belts.

This is quoted from [Wikipedia](https://en.wikipedia.org/wiki/Aurora). By the way, auroras have been been seen on both of these planets <q cite="https://en.wikipedia.org/wiki/Aurora">most clearly using the Hubble Space Telescope</q>.

## Colors

0. **Red**: Highest altitude, caused by oxygen atoms
0. **Green**: Lower altitude, caused by a higher density of oxygen atoms
0. **Blue**: Lowest altitude, caused by nitrogen atoms and molecules
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
