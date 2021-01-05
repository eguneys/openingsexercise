function rand(min, max) {
  return Math.random() * (max - min) + min;
}
function randInt(min, max) {
  return Math.floor(rand(min, max));
}
function arand(values) {
  return values[randInt(0, values.length)];
}

function OpeningSelector(ctx) {

  let { openingTable } = ctx;
  
  let opening;

  this.init = _opening => {

    if (!_opening) {
      _opening = arand(openingTable.allOpeningIds());
    }

    if (openingTable.openingName(_opening)) {
      opening = _opening;
    }
  };

  this.ready = () => !!opening;

  this.openingId = () => opening;
  this.openingName = () =>
    openingTable.openingName(opening);

  const pickNewOpening = (variationss) => {
    opening = arand(Object.keys(variationss));
  };

  this.selectVariation = (variationss) => {

    let variations = variationss[opening];

    let newOpening;

    if (!variations) {
      pickNewOpening(variationss);
      newOpening = opening;
    }

    variations = variationss[opening];

    return {
      newOpening,
      newBranch: variations.length > 1,
      variation: arand(variations)
    };
  };
}

module.exports = OpeningSelector;
