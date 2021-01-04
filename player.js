function Player(gamer) {

  const whiteIf = cond => cond ? 'white' : 'black';
  const opposite = color => whiteIf(color === 'black');

  let povColor,
      initialFen;

  this.init = (_povColor, _initialFen, moves, status) => {
    povColor = _povColor;
    initialFen = _initialFen;
    this.state(moves, status);
  };

  this.state = (moves, status) => {

    

  };
}

module.exports = Player;
