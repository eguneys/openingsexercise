module.exports = (coll) => {
  return new OpeningPlayerM(coll);
};


function OpeningPlayerM(coll) {

  const createNew = (name, opening) => ({
    id: name,
    name: name,
    opening
  });

  this.insert = (name, opening) =>
  coll.insert(createNew(name, opening));

  this.update = (name, f) =>
  coll.update(name, f);

  this.one = name =>
  coll.one(name);

}
