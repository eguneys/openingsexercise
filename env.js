let { envm } = require('./model');
let Project = require('./project');

module.exports = function() {

  this.isProd = process.env.NODE_ENV === 'production';

  this.awaitVariables = async function() {
    let { name } = await envm.envByKey("project-name");


    if (Project.name !== name) {
      console.error('Wrong Project.');
      process.exit(1);
    } else {
      console.log(`Connected to [${name}] Firestore`);
    }

    let { token } = await envm.envByKey("lichess-oauth2");

    this.oauth2Token = token;
  };

};
