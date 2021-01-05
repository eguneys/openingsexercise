let fixtures = {
  newOpening(name) {
    return `We play the ${name} opening now.`;
  },
  newBranch(variation) {
    return `We entered a new branch ${variation}.`;
  },
  outOfBook(maxDepth, ply) {
    return `I'm out of book now.
We scored ${ply} out of ${maxDepth} moves.
`;
  },
  openingNotFound(opening) {
    return `
Opening not found ${opening}. See my profile for a list of openings.
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
Pick an opening line from link in my profile to play.
Otherwise, I will play our last played opening.
💙
`;
  },
  startPlaying() {
    return `Type "Hello" to start playing now.`;
  }
};

module.exports = fixtures;
