let Env = require('./env');
let BotApi = require('./botapi');
let OpeningTable = require('./openingtable');
let OpeningLoader = require('./openingloader');

let env = new Env();

(async () => {

  await env.awaitVariables();

  let openingTable = new OpeningTable();
  let openingLoader = new OpeningLoader(openingTable);

  await openingLoader.loadAll();

  console.log(`Loaded ${openingTable.length()} opening sections.`);

  let ctx = {
    openingTable,
    token: env.oauth2Token
  };

  let botApi = BotApi(ctx);

  while (true) {
    console.log('openingsexercise waiting for challenges.');
    await botApi.listen();
  }
})();
