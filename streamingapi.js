const fetch = require('node-fetch');
const AbortController = require('abort-controller');
const ndjson = require('ndjson');

module.exports = ({
  url,
  headers,
  timeoutDelay = 15 * 60 * 1000
}, onData) => {
  let controller = new AbortController();

  let timeout;

  function scheduleAbort(resolve) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      controller.abort();
      if (resolve) {
        resolve();
      }
    }, timeoutDelay);
  }

  return fetch(url, {
    headers,
    signal: controller.signal
  }).then(res => {
    return new Promise((resolve, reject) => {
      scheduleAbort(resolve);
      res.body.pipe(ndjson.parse())
        .on('data', async (obj) => {
          onData(obj, resolve, controller);
          scheduleAbort(resolve);
        })
        .on('error', () => {
          reject();
        });
    });
  }).finally(() => {
    clearTimeout(timeout);
    controller.abort();
  });
};
