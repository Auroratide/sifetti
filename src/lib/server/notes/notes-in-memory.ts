import { peopleInMemory } from '../people/people-in-memory'

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

const markdown = `# Headings

You shouldn't use an h1 heading, but it's allowed in markdown, so...

## Level 2

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 

### Level 3

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 

#### Level 4

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 

##### Level 5

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 

###### Level 6

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 

## Paragraphs

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.

## Emphasis

Lorem **ipsum** dolor sit _amet_, consectetur **_adipiscing elit_**, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

## Quotes

> Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

Some text here.

> Duis aute irure dolor in <mark>reprehenderit</mark> in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
> 
>> Lorem **ipsum** dolor sit _amet_, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

## Lists

* Unordered list
* Unordered list
* Unordered list
  * Nesting
  * Nesting
* Unordered list
  0. Ordered in unordered
  0. Ordered in unordered

0. Ordered List
0. Ordered List
  0. Nesting
  0. Nesting
0. Ordered List
0. Ordered List
  * Unordered in ordered
  * Unordered in ordered

<dl>
  <dt>Item 1</dt>
  <dd>Def 1</dd>
  <dt>Item 2</dt>
  <dd>Def 2</dd>
  <dt>Item 3</dt>
  <dd>Def 3</dd>
</dl>

## Code

In Javascript, you should use \`let\` and \`const\` instead of \`var\`.

\`\`\`javascript
const add = (a, b) => a + b;

console.log(add(6, 7));
\`\`\`

## Images

Small image:

![aurora over a river](https://media.istockphoto.com/photos/northern-lights-picture-id813910732?b=1&k=6&m=813910732&s=170x170&h=T6ebNSzTN9qy1BtCCM_3GeR3lmCTY1NVMGbBkrc8dkU=)

Large image:

![drawing of aurora over lake](https://wallpapercave.com/wp/gibm4cx.jpg)

## Horizontal Rules

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 

---------

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

## Links

Have a look at [auroratide.com](https://auroratide.com). Here is a [local link](/notes/1).

## Tables

| Heading | Heading |
| ------- | ------- |
| Value   | Value   |
| Value   | Value   |
| Value   | Value   |
`

export const notesInMemory = {
    borealis: {
        id: '1',
        author: peopleInMemory.aurora.id,
        title: 'Borealis',
        content: borealis,
        createdAt: new Date(Date.parse('2022-02-22T00:00:00.000Z')),
        updatedAt: new Date(Date.parse('2022-02-22T00:05:00.000Z')),
    },
    australis: {
        id: '2',
        author: peopleInMemory.aurora.id,
        title: 'Australis',
        content: 'These happen in the southern hemisphere.',
        createdAt: new Date(Date.parse('2022-02-22T00:06:00.000Z')),
        updatedAt: new Date(Date.parse('2022-02-22T00:07:00.000Z')),
    },
    markdown: {
        id: '3',
        author: peopleInMemory.aurora.id,
        title: 'Markdown Showcase',
        content: markdown,
        createdAt: new Date(Date.parse('2022-02-23T00:00:00.000Z')),
        updatedAt: new Date(Date.parse('2022-02-23T00:03:00.000Z')),
    }
}
