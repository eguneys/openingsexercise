function EnvM(coll) {
  
  this.envByKey = key =>
  coll.one(key);
  
}

module.exports = (coll) => {
  return new EnvM(coll);
};
