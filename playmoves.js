let { parseUci, valid, Situation } = require('jhess');

module.exports = function playMoves(moves) {
  return moves.reduce((vSituation, move) =>
    vSituation.flatMap(_ =>
      parseUci(move).flatMap(uci => 
        uci.move(_)
          .map(_ => _.situationAfter())
      ))
    ,valid(Situation.apply()));
};
