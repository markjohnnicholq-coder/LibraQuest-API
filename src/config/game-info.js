// What the Library Game Hub shows about YOUR game (Hub Contract, rule 1).
// Lab Step 6: replace every CHANGE_ME value with your own.
const pkg = require('../../package.json');

module.exports = {
  slug: 'libraquest-api',            // your group's game, lower case with hyphens, for example shelf-climb
  name: 'LibraQuest API',            // the name players will see
  team: 'Team 5',            // your group's name and section, for example Bookworms (3-1)
  developer: 'markjohnnicholq-coder',       // YOUR GitHub username: this build is yours
  description: 'Answer speed-based library questions, collect stars, and race to the top of the library leaderboard.',     // one sentence about how the game is played
  min_players: 1,               // change to the limits your game is designed for
  max_players: 30,
  version: pkg.version,         // read from package.json, do not edit here
};
