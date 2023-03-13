import * as at from './apil'
import { Conf } from './conf'
import fetch from 'node-fetch'
import { PlayOnTurn } from './play'
import { fen_after_ucis, read_pgn, OPicker } from './pgn'


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


export class StudyImport {

  static get = (conf: Conf, userId: at.UserId) => Promise.resolve(new StudyImport(conf, userId))

  picker?: OPicker

  constructor(readonly conf: Conf, userId: at.UserId) {
  }

  lastMove?: string

  pick_move(ctx: PlayOnTurn, fen: string) {

    if (!this.picker) {
      return false
    }

    let move = this.picker.pick_move(fen)

    if (move) {
      this.lastMove = fen
      ctx.move(move)
      return true
    } else {
      if (this.lastMove) {
        let score = this.picker.score(this.lastMove)
        if (score) {
          this.lastMove = undefined

          ctx.chat(`Out of book now. Score: ${score.ply}/${score.max_ply}`)
          ctx.offerDrawNextMove = true
        }
      }
    }
    return false
  }

  abort(status: at.GameStatus) {

  }

  move(ctx: PlayOnTurn, position: string, moves: Array<string>) {
    let res = false
    let fen = fen_after_ucis(position, moves)
    if (fen) {
      res = this.pick_move(ctx, fen)
    } else {
      return Promise.reject(`Can't find fen after ucis ${position} ${moves}`)
    }
    return Promise.resolve(res)
  }


  async maybeLoad(ctx: PlayOnTurn, link: string) {


    let chapter = await match_chapter(link)

    if (chapter) {
      await ctx.chat(`Loading ${chapter.matched_reg} ...`)

      let opgn = read_pgn(chapter.pgn)
      let picker = new OPicker(opgn)
      this.picker = picker
      ctx.chat(opgn.title)
    } else {
    }

  }

}
