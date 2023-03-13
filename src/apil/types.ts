export type Authorization = {
  token: string
};

export type Fen = string
export type Uci = string

export type ChallengeId = string
export type UserId = string
export type GameId = string
export type GameStatus = string
export type VariantKey = string
export type TimeControlShow = string

export type ChatRoom =
  | "player"
  | "spectator"

export type TimeControl = {
  "type":"clock",
  "limit": number,
  "increment": number,
  "show": TimeControlShow
}

export type GameStart = {
  "type":"gameStart",
  "game": {
    "id": GameId
  }
}

export type GameFinish = {
  "type": "gameFinish",
  "game": {
    "id": GameId
  }
}

export type User = {
  id: UserId,
  name: string
}

export type DeclineReason =
  | "generic"
  | "later"
  | "tooFast"
  | "tooSlow"
  | "timeControl"
  | "rated"
  | "casual"
  | "standard"
  | "variant"
  | "noBot"
  | "onlyBot"

export type Challenge = {
  "type":"challenge",
  "challenge":{
    "id":GameId,
    "status": GameStatus,
    "challenger": User,
    "destUser": User,
    "variant": { "key": string },
    "rated": boolean,
    "timeControl": TimeControl
  }
}

export type IncomingEvent =
  | GameStart
  | GameFinish
  | Challenge

export type GameFull = {
  "type": "gameFull",
  "id": GameId,
  "rated": boolean,
  "variant": any,
  "clock": any,
  "speed": string,
  "perf": any,
  "createdAt": number,
  "white": User,
  "black": User,
  "initialFen": Fen
  "state": GameState
};

export type Color =
  | "white"
  | "black"

export type GameState = {
  "type": "gameState",
  "moves": string,
  "wtime": number,
  "btime": number,
  "winc": number,
  "binc": number
  "status": GameStatus
  "winner": Color
};

export type ChatLine = {
  "type": "chatLine",
  "username": string,
  "text": string,
  "room": string
}

export function isGameStart(_: IncomingEvent): _ is GameStart {
  return (_['type'] === 'gameStart');
}
export function isGameFinish(_: IncomingEvent): _ is GameFinish {
  return (_['type'] === 'gameFinish');
}
export function isChallenge(_: IncomingEvent): _ is Challenge {
  return (_['type'] === 'challenge');
}


export type IncomingGameState =
  | GameFull
  | GameState
  | ChatLine

export function isGameFull(_: IncomingGameState): _ is GameFull {
  return (_['type'] === 'gameFull');
}
export function isGameState(_: IncomingGameState): _ is GameState {
  return (_['type'] === 'gameState');
}
export function isChatLine(_: IncomingGameState): _ is ChatLine {
  return (_['type'] === 'chatLine');
}
