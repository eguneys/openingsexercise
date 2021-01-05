let MovePicker = require('./movepicker');
const fixtures = require('./chatfixtures');

function Player(gamer, ctx) {

  let { openingTable } = ctx;

  const whiteIf = cond => cond ? 'white' : 'black';
  const opposite = color => whiteIf(color === 'black');

  let povColor,
      initialFen;

  let moves,
      status;

  let bookMaxDepth,
      bookPly;

  let picker = new MovePicker(this, ctx);

  const turnColor = () => whiteIf(moves.length % 2 === 0);

  this.init = (_povColor, _initialFen, moves, status) => {
    povColor = _povColor;
    initialFen = _initialFen;
    this.state(moves, status);
  };

  this.state = (_moves, _status) => {
    moves = _moves.split(' ').filter(_ => !!_);
    status = _status;

    if (status !== 'started') {
      return;
    }
    if (moves.length === 0) {
      gamer.greet();
    }
    checkPlay();
  };

  this.outOfBook = () => {
    gamer.chat(fixtures.outOfBook(bookMaxDepth - 1, bookPly));
  };

  this.startPlay = (openingId) => {
    if (picker.ready()) {
      checkPlay();
      return;
    }

    pickOpening(openingId);

    checkPlay();
  };

  const pickOpening = (openingId) => {
    picker.init(openingId);
    let opName = picker.openingName();
    if (!opName) {
      gamer.chat(fixtures.openingNotFound(openingId));
    } else {
      gamer.chat(fixtures.openingLine(opName));
    }
  };

  const checkPlay = async () => {
    if (!picker.ready()) {
      return;
    }
    
    if (turnColor() === povColor) {
      let { uci, 
            variation,
            outofbook,
            depth,
            ply,
            newBranch,
            newOpening } = await picker.pickMove(moves);

      gamer.play(uci, outofbook);

      if (outofbook) {
        this.outOfBook();
      }

      if (depth) {
        bookMaxDepth = depth;
        bookPly = ply;
      }


      if (newOpening) {
        gamer.chat(fixtures.newOpening(openingTable.openingName(newOpening)));
      }

      if (newBranch) {
        gamer.chat(fixtures.newBranch(variation));
      }

    }
  };
}

module.exports = Player;
