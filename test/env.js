let { envm } = require('../model');

async function env() {
  
  let liapi = await envm.envByKey('lichessapi');

  console.log(liapi);
  
}

module.exports = env;
