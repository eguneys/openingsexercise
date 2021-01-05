let { valid, Situation } = require('jhess');

module.exports = function playMoves(moves) {
  return moves.reduce((vSituation, move) =>
    vSituation.flatMap(_ => _.move(move)
                       .map(_ => _.situationAfter()))
    ,valid(Situation.apply()));
};
