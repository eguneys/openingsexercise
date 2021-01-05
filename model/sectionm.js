module.exports = (coll) => {
  return new OpeningM(coll);
};


function OpeningM(coll) {

  this.sectionById = sectionId =>
  coll.one(sectionId);

  this.all = () =>
  coll.all();

}
