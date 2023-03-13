import fetch from 'node-fetch'


let chapterIdReg = /^https:\/\/lichess\.org\/study\/([A-Za-z0-9]{8})\/([A-Za-z0-9]{8})$/;
let studyIdReg = /^https:\/\/lichess\.org\/study\/([A-Za-z0-9]{8})$/;

export type LoadChapter = {
  matched_reg: string,
  pgn: string
}

export async function match_chapter(link: string) {
  let match = link.match(chapterIdReg)


  if (match) {
    let matched_reg = `${match[1]}/${match[2]}`
    let pgn = await oneChapter(match[1], match[2])

    return {
      matched_reg,
      pgn
    }
  }
}


function oneChapter(study: string, chapter: string) {
  return fetch(`https://lichess.org/study/${study}/${chapter}.pgn`)
    .then(res => {
    return res.text()
  })
}
