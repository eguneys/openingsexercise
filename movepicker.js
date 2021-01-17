let OpeningSelector = require('./openingselector');
let playMoves = require('./playmoves');

let enginePlayer = require('./engine');

function MovePicker(player, ctx) {

  let { openingTable } = ctx;

  let outofbook;
  let openingSelector = new OpeningSelector(ctx);

  this.init = (opening) => {
    outofbook = false;
    openingSelector.init(opening);
  };

  this.openingId = () => openingSelector.openingId();
  this.ready = () => openingSelector.ready();
  this.openingName = () => openingSelector.openingName();

  this.pickMove = async moves => {

    let move;

    if (!outofbook) {

      move = await bookMove(moves);

      if (!move) {
        move = await engineMove(moves);
        move.outofbook = true;
        outofbook = true;
      }
    } else {
      move = await engineMove(moves);
    }

    return move;
  };

  async function engineMove(moves) {
    return enginePlayer.go(moves);
  }

  async function bookMove(moves) {
    let fen = playMoves(moves)
        .map(_ => _.toFen())
        .getOrElse((err) => {
          console.error(`[Failed to play moves] ${err}`);
          return false;
        });

    if (!fen) {
      return false;
    }

    let vss = openingTable.variationsByFen(fen);

    if (Object.keys(vss).length === 0) {
      return false;
    }

    let { variation, 
          ...rest } = 
        openingSelector.selectVariation(vss);

    return {
      ...variation,
      ...rest
    };
  }

}

module.exports = MovePicker;
