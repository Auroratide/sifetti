import { suite } from 'uvu'
import * as assert from '../../assert'
import { parser } from '../../../src/lib/rendering/markdown'

const test = suite('Markdown Parser')

const md = `
## Hi there

This is a test.

<div class="hi" onclick="alert('hi')">This is cool</div>

<script>
alert('hello');
</script>
`

test('dirty html provided', async () => {
    const parse = await parser()
    const parsed = parse(md)

    assert.match(parsed, '<h2 id="hi-there">Hi there</h2>')
    assert.not.match(parsed, 'onclick')
    assert.not.match(parsed, '<script>')
})

test('not wanting an entirely new paragraph', async () => {
    const parse = await parser()

    const md = `## use breaks

Hello
World
`
    const parsed = parse(md)

    assert.match(parsed, 'Hello<br>World')
})

test.run()
