let { Engine } = require('node-uci');

function EnginePlayer() {

  const engine = new Engine('./engine/stockfish_20090216_x64');

  this.init = async () => {
    await engine.init();
  };

  this.go = async moves => {

    await engine.position('startpos', moves);

    let res = await engine.go({ depth: 8 });
    return {
      uci: res.bestmove
    };    
  };
  
}

module.exports = EnginePlayer;
