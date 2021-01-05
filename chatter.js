function Chatter(gamer) {

  let botName,
      opponentName;

  this.init = (bot, opp) => {
    botName = bot;
    opponentName = opp;
  };

  this.chatLine = line => {
    let { username, text } = line;

    if (username === opponentName) {
      parse(text);
    }
  };

  const parse = (text) => {
    let openingRegex = /[a-z0-9]*/;

    switch (text) {
    case "Hello":
    case "Good luck":
    case "Have fun!":
      gamer.startPlay();
      break;
    default:
      if (text.match(openingRegex)) {
        gamer.selectOpening(text);
      }
    }
  };
  
}

module.exports = Chatter;
