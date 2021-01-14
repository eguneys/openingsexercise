let { openingPlayerm } = require('./model');
const fixtures = require('./chatfixtures');

function PlayerHistory(gamer, ctx) {

  let { openingTable } = ctx;

  let history;
  let name;


  const beginSelectOpening = async () => {
    history = await openingPlayerm.one(name);

    if (!history) {
      let opening = gamer.pickRandomOpeningAndTell();


      history = await openingPlayerm.insert(name, opening);
    } else {
      gamer.pickOpeningAndPlay(history.opening);
    }
  };
  
  this.init = (_name) => {
    name = _name;

    beginSelectOpening();
  };

  this.pickOpening = async opening => {

    let openingName = openingTable.openingName(opening);

    if (openingName) {
      gamer.chat(fixtures.openingFound(opening));
    } else {
      gamer.chat(fixtures.openingNotFound(opening));
    }

    await openingPlayerm.update(name, {
      opening
    });
  };

  
}

module.exports = PlayerHistory;
