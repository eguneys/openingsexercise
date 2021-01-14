let store = require('./firestore');

const isProd = process.env.NODE_ENV === 'production';
const mName = name => isProd ? name : `${name}-dev`;

const envName = mName('env');
const opening = mName('opening');
const openingPlayer = mName('openingplayer');

const mInit = (m, coll) => m(store(coll));

module.exports = {
  envm: mInit(require('./envm'), envName),
  sectionm: mInit(require('./sectionm'), opening),
  openingPlayerm: mInit(require('./openingPlayerm'), openingPlayer),
  terminate: store.terminate
};
