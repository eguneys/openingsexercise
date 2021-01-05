let { Play } = require('jhess');

module.exports = function OpeningTable() {
  
  let openingNames = {};
  let fensByOpening = {};

  this.load = (opening, content, name) => {
    let play = new Play(content);

    fensByOpening[opening] = play.export();
    openingNames[opening] = name;
  };

  this.length = () => Object.keys(openingNames).length;

  this.allOpeningIds = () => Object.keys(openingNames);

  this.openingName = opening => 
  openingNames[opening];

  this.variationsByFen = (fen) => {

    let res = {};

    for (let opening in fensByOpening) {
      let { fens, depths } = fensByOpening[opening];

      if (fens[fen]) {
        res[opening] = fens[fen];
      }
    }

    return res;
  };  
  
};
