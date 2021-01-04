let store = require('./firestore');

const isProd = process.env.NODE_ENV === 'production';
const mName = name => isProd ? name : `${name}-dev`;

const envName = mName('env');

const mInit = (m, coll) => m(store(coll));

module.exports = {
  envm: mInit(require('./envm'), envName),
  terminate: store.terminate
};
