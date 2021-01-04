let Env = require('./env');
let BotApi = require('./botapi');

let env = new Env();

(async () => {

  await env.awaitVariables();

  let botApi = BotApi(env.oauth2Token);

  while (true) {
    console.log('openingsexercise waiting for challenges.');
    await botApi.listen();
  }
})();
