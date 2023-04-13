import { Conf } from './conf'
import { canAccept, acceptConfig } from './accept'
import { Stream } from './stream'
import * as at from './apil'
import { xhr, xhr_form} from './xhr'
import { Play, PlayOnTurn, IPlayer } from './play'


export async function accept_challenges(conf: Conf, player: IPlayer) {

  const { token } = conf
  let plays: Map<at.GameId, Play> = new Map()


  function respondGameStart(id: at.ChallengeId) {
    let play = PlayOnTurn.make(conf, id, player)

    play.play().then(() => {
      plays.delete(id)
    }).catch((e: any) => { plays.delete(id) })

    plays.set(id, play)
  }

  function respondChallenge(id: at.ChallengeId, reason?: at.DeclineReason) {
    if (plays.size > 2) {
      if (!reason) {
        reason = 'later'
      }
    }

    if (!reason) {
      challenge_accept(token, id)
    } else {
      challenge_decline(token, id, reason)
    }
  }


  let config = acceptConfig(conf.acceptOptions)

  let { abort, response } = await incomingEvents(conf.token)

  let dispose = () => {
    response.destroy()
    abort()
  }


  response.on('data', data => {
    if (at.isGameStart(data)) {
      respondGameStart(data.game.id)
    } else if (at.isGameFinish(data)) {
    } else if (at.isChallenge(data)) {
      let reason = canAccept(data, config)
      respondChallenge(data.challenge.id, reason)
    }
  })

  //response.on('close', () => console.log('closed'))
  //response.on('end', () => console.log('ended'))


  return dispose
}


const incomingEvents = (token: string) => {
  let stream = new Stream('https://lichess.org')
  return stream.ndjson('/api/stream/event', {
    headers: { 'Authorization': `Bearer ${token}` }
  })

}


const lichess = 'https://lichess.org'

const challenge_accept = (token: string, id: at.ChallengeId) => {
  xhr(lichess + `/api/challenge/${id}/accept`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    method: 'POST'
  })
}

const challenge_decline = (token: string, id: at.ChallengeId, reason?: at.DeclineReason) => {
  xhr(lichess + `/api/challenge/${id}/decline`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    method: 'POST',
    body: xhr_form({
      reason
    })
  })
}
