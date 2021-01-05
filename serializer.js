function Serializer() {

  let lastPromise = Promise.resolve();

  this.queue = fn => {
    lastPromise = lastPromise.then(fn);
    return lastPromise;
  };
  

};

module.exports = Serializer;
