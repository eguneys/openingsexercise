let Project = require('../project');
let { envm, terminate } = require('../model');

let env = require('./env');
let moves = require('./moves');
let api = require('./api');

(async () => {

  let { name } = await envm.envByKey('project-name');

  console.log(`Connected to [${name}]`);

  if (Project.name !== name) {
    console.error(`Wrong Project.`);
    process.exit(2);
  }

  // await env();

  // moves();

  await api();

  await terminate();

  process.exit();
})();
