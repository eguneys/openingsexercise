let { Engine } = require('node-uci');

function EnginePlayer() {

  const engine = new Engine('./engine/stockfish_20090216_x64');

  const tryInit = async () => {
    if (!initialized) {
      await engine.init();
    }
    initialized = true;
  };

  let initialized = false;

  let queue = Promise.resolve();

  this.go = async moves => {
    tryInit();
    return goQueue(moves);
  };

  const goQueue = async moves => {
    queue = queue.then(() => goNow(moves));
    return queue;
  };

  const goNow = async moves => {

    await engine.position('startpos', moves);

    let res = await engine.go({ depth: 8 });
    return {
      uci: res.bestmove
    };    
  };
  
}

module.exports = new EnginePlayer();
