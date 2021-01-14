let fixtures = {
  newOpening(name) {
    return `We play the ${name} opening now.`;
  },
  newBranch(variation) {
    return `We entered a new branch ${variation}.`;
  },
  outOfBook(maxDepth, ply) {
    let res =  `I'm out of book now.`;
    if (ply) {
      res += `We scored ${ply} out of ${maxDepth} moves.`;
    }
    return res;
  },
  openingFound(openingHandle) {
    return `
Your opening preference is set to ${openingHandle}.
I will play it next.
`;
  },
  openingNotFound(opening) {
    return `
Opening not found ${opening}. See my profile for a list of openings.
I will play a random opening next.
`;
  },
  openingLine(line) {
    return `
I'll go for ${line}.
`;
  },
  greet(name) {
    return `
Hi, ${name}. 
Pick an opening line from link in my profile.
Otherwise, I will play a random opening.
💙
`;
  }
};

module.exports = fixtures;
