let { sectionm } = require('./model');

module.exports = function OpeningLoader(openingTable) {

  const loadSection = (section) => {
    let { handle, name, content } = section;

    if (content) {
      openingTable.load(handle, content, name);
      return true;
    }
    return false;
  };

  this.loadAll = async () => {
    let all = await sectionm.all();

    return all.reduce((acc, _) => 
      loadSection(_) ? acc + 1: acc,
      0);
  };

  this.load = async opening => {

    let section = await sectionm.sectionById(opening);

    if (section) {
      loadSection(section);
      return true;
    }
    return false;
  };


};
