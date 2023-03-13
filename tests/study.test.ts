import { it, expect } from 'vitest'
import { match_chapter } from '../src/study'

const chapters = [
  'https://lichess.org/study/TCnt4Tx7/RIQSuuxt',
  'https://lichess.org/study/TCnt4Tx7/chMQbGbz',
  'https://lichess.org/study/TCnt4Tx7/NtE2wnNI',
  'https://lichess.org/study/TCnt4Tx7/7G9ZtvNA',
]

it('loads study', async () => {

  let fail  = await match_chapter('hello')
  expect(fail).toBe(undefined)

  let res = await match_chapter(chapters[0])
  expect(res.pgn).toBeDefined()

})
