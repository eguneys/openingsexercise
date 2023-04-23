import { Conf } from './conf'
import * as at from './apil'
import { Stream } from './stream'
import { xhr, xhr_form } from './xhr'

export interface IPlayer {
  init(): Promise<void>
  move(ctx: PlayOnTurn, position: string, moves: Array<string>): Promise<boolean>;
  chat(ctx: PlayOnTurn, chat: at.ChatLine): Promise<void>;
  abort(ctx: PlayOnTurn, status: at.GameStatus): Promise<void>;
}

export abstract class Play {

  fAbort?: () => void
  gameFull?: at.GameFull

  constructor(readonly conf: Conf, readonly game_id: at.GameId) {}


  respondGameFull(data: at.GameFull) {
    this.gameFull = data

    this.full(this.gameFull)
    this.respondGameState(this.gameFull.state)
  }

  respondGameState(state: at.GameState) {
    if (!this.gameFull || state.status !== 'started') {
      this.respondGameAbort(state.status)
      return
    }

    this.gameFull.state.moves = state.moves
    this.state(state)
  }

  async respondGameAbort(status: at.GameStatus) {
    await this.abort(status)
    this.fAbort?.()
  }
  async play() {
    return gameState(this.conf.token, this.game_id)
    .then(_ => {
      if (!_) {
        return
      }

      let { abort, response } = _

      response.on('data', data => {
        if (at.isGameFull(data)) {
          this.respondGameFull(data)
        } else if (at.isGameState(data)) {
          this.respondGameState(data)
        } else if (at.isChatLine(data)) {
          this.respondGameChat(data)
        }
      })


      response.on('error', () => {})

      return new Promise<void>(resolve => {

        let c_timeout = setTimeout(() => {
          response.destroy()
          abort()
          resolve()
        }, this.conf.timeout * 60 * 1000)


        this.fAbort = () => {
          clearTimeout(c_timeout)
          response.destroy()
          abort()
          resolve()
        }
      })
    })
  }

	move(uci: at.Uci, offeringDraw?: boolean) {
    return api_move(this.conf.token, this.game_id, uci, offeringDraw)
		.catch(_ => console.error(`Move fail ${uci} : ${_}`))
	}

	chat(chat: string) {
    return api_chat(this.conf.token, this.game_id, 'player', chat).catch(_ => console.error(_))
	}


  abstract respondGameChat(data: at.ChatLine): Promise<void>
  abstract full(full: at.GameFull): Promise<void>
  abstract state(state: at.GameState): Promise<void>
  abstract abort(status: at.GameStatus): Promise<void>
}

export class PlayOnTurn extends Play {

  static make = (conf: Conf, id: at.GameId, player: IPlayer)  => {
    return new PlayOnTurn(conf, id, player)
  }


  pov!: at.Color
  opponent!: at.User
  initialTurn!: at.Color
  initialFen!: at.Fen
  moves!: string
  status!: at.GameStatus

	offerDrawNextMove: boolean = false

  constructor(readonly conf: Conf, 
              readonly game_id: at.GameId, 
              readonly player: IPlayer) { super(conf, game_id) }


  move(uci: at.Uci, offeringDraw?: boolean) {
    if (this.offerDrawNextMove) {
      this.offerDrawNextMove = false
      offeringDraw = true
    }

    return super.move(uci, offeringDraw)
  }


  async _move(turn: at.Color) {
    if (turn === this.pov) {
      let fen = this.initialFen,
        moves = this.moves === '' ? []: this.moves.split(' ')
      this.player.move(this, fen, moves)
    }
  }


  async _chat(_: at.ChatLine) {
    if (_.username === this.opponent.name) {
      this.player.chat(this, _)
    }
  }


  async _abort(_: at.GameStatus) {
    this.player.abort(this, _)
  }

  async full(data: at.GameFull) {

    this.pov = (data.white.id === this.conf.id) ? 'white' : 'black'
    this.opponent = data[oppositeColor(this.pov)]
    this.initialTurn = fenTurn(data.initialFen)
    this.initialFen = data.initialFen

    this.moves = data.state.moves
    this.status = data.state.status
  }

  async state(data: at.GameState) {
    let evenTurn = (data.moves === '')|| data.moves.split(' ').length % 2 === 0,
    turn = evenTurn ? this.initialTurn : oppositeColor(this.initialTurn);

    let moves_changed = this.moves === '' || this.moves !== data.moves

    this.moves = data.moves;
    this.status = data.status;

    if (moves_changed) {
      this._move(turn);
    }
  }

  async respondGameChat(data: at.ChatLine) {
    this._chat(data)
  }

  async abort(status: at.GameStatus) {
    this._abort(status)
  }

}

function fenTurn(fen: at.Fen) {
  if (fen === 'startpos') {
    return 'white';
  } else {
    let [_, color] = fen.split(' ');
    return color === 'w'? 'white':'black';
  }
}

function oppositeColor(color: at.Color) {
  return color === 'white' ? 'black' : 'white';
}

const lichess = 'https://lichess.org'

const gameState = (token: string, id: at.GameId) => {
  let stream = new Stream('https://lichess.org')
  return stream.ndjson(`/api/bot/game/stream/${id}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
}

const api_chat = (token: string, id: at.GameId, room: at.ChatRoom, text: string) => {
  return xhr(lichess + `/api/bot/game/${id}/chat`, {
		method: 'POST',
    headers: {
      "Authorization": `Bearer ${token}`
    },
		body: xhr_form({
      room,
			text
		})
	})
}

const api_move = (token: string, id: at.GameId, move: at.Uci, offeringDraw?: boolean) => {
  return xhr(lichess + `/api/bot/game/${id}/move/${move}?offeringDraw=${offeringDraw||false}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    },
		method: 'POST'
})
}
