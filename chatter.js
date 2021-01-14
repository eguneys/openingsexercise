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
    default:
      if (text.match(openingRegex)) {
        gamer.pickOpeningInChat(text);
      }
    }
  };
  
}

module.exports = Chatter;
