const fetch = require('node-fetch');
const listenStreaming = require('./streamingapi');
const Player = require('./player');

function BotApi(token) {

  let headers = {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json'
  };

  this.listenGame = async (gameId) => {
    
    let gamer = new Gamer(this);

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
    let url = `https://lichess.org/api/challenge/${challengeId}/accept`;

    await fetch(url, { headers, method: 'POST' });
  };

  this.decline = async (challengeId) => {
    let url = `https://lichess.org/api/challenge/${challengeId}/decline`;

    await fetch(url, { headers, method: 'POST' });    
  };


  this.chat = async (gameId, text) => {
    let url = `https://lichess.org/api/bot/game/${gameId}/chat`;

    await fetch(url, { headers, method: 'POST', body: {
      room: 'player',
      text
    } });
  };
  
}

function Gamer(botApi) {

  const whiteIf = cond => cond ? 'white' : 'black';
  const opposite = color => whiteIf(color === 'black');

  let botName = 'openingsexercise';
  let povColor,
      opponentColor,
      opponentName,
      moves;

  let player = new Player(this);

  const maybeAbortStatus = status => {
    return status !== 'started';
  };

  this.gameFull = (game) => {
    let { white, black, initialFen, state } = game;

    let { moves, status } = state;

    povColor = whiteIf(white.name === botName);
    opponentColor = opposite(povColor);

    opponentName = game[opponentColor].name;

    player.init(povColor, initialFen, moves, status);

    return maybeAbortStatus(status);
  };

  this.gameState = (state) => {
    let { moves, status } = state;
    
    player.state(moves, status);

    return maybeAbortStatus(status);
  };

  this.chatLine = (line) => {
    console.log(line);
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
