const { URLSearchParams } = require('url');
const Rapi = require('./reliableapi');
const listenStreaming = require('./streamingapi');

const Player = require('./player');
const Chatter = require('./chatter');

const fixtures = require('./chatfixtures');

const Serializer = require('./serializer');

function BotApi(ctx) {

  let serializer = new Serializer();

  let { token } = ctx;

  let headers = {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json'
  };

  let rApi = new Rapi('https://lichess.org/');

  this.listenGame = async (gameId) => {
    
    let gamer = new Gamer(this, gameId, ctx);

    let url = `https://lichess.org/api/bot/game/stream/${gameId}`;

    return listenStreaming({
      url,
      headers
    }, async (data, resolve) => {
      switch (data.type) {
      case "gameFull":
        if (gamer.gameFull(data)) {
          resolve();
        }
        break;
      case "gameState":
        if (gamer.gameState(data)) {
          resolve();
        }
        break;
      case "chatLine":
        gamer.chatLine(data);
        break;
      }
    });
    

    return gamer;
  };

  this.listen = async () => {

    let eventApi = new EventManager(this);

    let url = `https://lichess.org/api/stream/event`;

    return listenStreaming({
      url,
      headers
    }, async (data, resolve) => {

      switch(data.type) {
      case 'gameStart':
        eventApi.gameStart(data.game);
        break;
      case 'gameFinish':
        // eventApi.gameFinish(data.game);
        break;
      case 'challenge':
        eventApi.challenge(data.challenge);
        break;
      case 'challengeCanceled':
        eventApi.challengeCanceled(data.challenge);
        break;
      default:
        break;
      }

    });
  };

  this.accept = async (challengeId) => {
    let url = `api/challenge/${challengeId}/accept`;

    await rApi.json(url, { headers, method: 'POST' });
  };

  this.decline = async (challengeId) => {
    let url = `api/challenge/${challengeId}/decline`;

    await rApi.json(url, { headers, method: 'POST' });    
  };


  this.chat = async (gameId, text) => {
    let url = `api/bot/game/${gameId}/chat`;

    const params = new URLSearchParams();
    params.append('room', 'player');
    params.append('text', text);

    await rApi.json(url, { headers, method: 'POST', body: params });
  };

  this.play = async (gameId, uci, offerDraw) => {
    let url = `api/bot/game/${gameId}/move/${uci}`;

    const params = new URLSearchParams();
    params.append('offeringDraw', !!offerDraw);

    await rApi.json(url + '?' + params, { headers, method: 'POST', params });
  };
  
}

function Gamer(botApi, gameId, ctx) {

  const whiteIf = cond => cond ? 'white' : 'black';
  const opposite = color => whiteIf(color === 'black');

  let botName = 'openingsexercise';
  let povColor,
      opponentColor,
      opponentName,
      moves;

  let player = new Player(this, ctx);
  let chatter = new Chatter(this);

  const maybeAbortStatus = status => {
    return status !== 'started';
  };

  this.greet = () => {
    botApi.chat(gameId, fixtures.greet(opponentName));
    botApi.chat(gameId, fixtures.startPlaying());
  };

  this.chatOpeningLine = line => {
    botApi.chat(gameId, fixtures.openingLine(line));
  };

  this.chat = line => {
    botApi.chat(gameId, line);
  };

  this.play = (uci, offerDraw) => {
    botApi.play(gameId, uci, offerDraw);
  };

  this.startPlay = () => {
    player.startPlay();
  };

  this.selectOpening = opening => {
    player.startPlay(opening);
  };

  this.gameFull = (game) => {
    let { white, black, initialFen, state } = game;

    let { moves, status } = state;

    povColor = whiteIf(white.name === botName);
    opponentColor = opposite(povColor);

    opponentName = game[opponentColor].name;

    player.init(povColor, initialFen, moves, status);

    chatter.init(botName, opponentName);

    return maybeAbortStatus(status);
  };

  this.gameState = (state) => {
    let { moves, status } = state;
    
    player.state(moves, status);

    return maybeAbortStatus(status);
  };

  this.chatLine = (line) => {
    chatter.chatLine(line);
  };

}

function EventManager(botApi) {

  let challenger = new Challenger(botApi);

  let ongoing = [];

  function add(id) {
    ongoing.push(id);
  }

  function remove(id) {
    ongoing = ongoing.filter(_ => _ !== id);
  }

  this.gameStart = async (game) => {
    add(game.id);
    await botApi.listenGame(game.id);
    remove(game.id);
    acceptOne();
  };

  this.challenge = (challenge) => {
    challenger.challenge(challenge);
    acceptOne();
  };

  this.challengeCanceled = (challenge) => {
    challenger.challengeCancel(challenge);
  };

  const acceptOne = () => {
    setTimeout(acceptNow, 1000);
  };

  const acceptNow = async () => {
    let id = challenger.accept();

    if (id) {
      await botApi.accept(id);
    }
  };
  
}

function Challenger(botApi) {

  let challenges = [];

  this.challenges = () => challenges;

  this.accept = () => {
    return challenges.pop();
  };

  this.challenge = (challenge) => {
    if (challenges.length < 5 &&
        challengeOk(challenge)) {
      queue(challenge);
    } else {
      decline(challenge.id);
    }
  };

  this.challengeCancel = (challenge) => {
    dequeue(challenge);
  };


  const queue = challenge => {
    challenges.push(challenge.id);
  };

  const dequeue = challenge => {
    challenges = challenges.filter(_ => _ !== challenge.id);
  };

  const decline = challenge => {
    botApi.decline(challenge);
  };

  let variants = ['standard'];
  let timeControls = ['3+0', '1+0', '5+0', '10+0'];

  const challengeOk = challenge => {
    let { variant, timeControl } = challenge;

    return variants.includes(variant.key) &&
      timeControls.includes(timeControl.show);
  };
  
}

module.exports = token => new BotApi(token);
