var fsSync = require('fs');
var fs = require('fs').promises;

require.extensions['.txt'] = function (module, filename) {
  module.exports = fsSync.readFileSync(filename, 'utf8');
};

var wordsByFrequency = require('./scowl/words-by-frequency.txt');
var wordlist10 = require('./scowl/english-words.10.txt');
var wordlist10u = require('./scowl/english-upper.10.txt');
var wordlist10c = require('./scowl/english-contractions.10.txt');
var wordlist10a = require('./scowl/english-abbreviations.10.txt');
var wordlist10can = require('./scowl/canadian-words.10.txt');
var wordlist20 = require('./scowl/english-words.20.txt');
var wordlist20a = require('./scowl/english-abbreviations.20.txt');
var wordlist20can = require('./scowl/canadian-words.20.txt');
var wordlist35 = require('./scowl/english-words.35.txt');
var wordlist35u = require('./scowl/english-upper.35.txt');
var wordlist35c = require('./scowl/english-contractions.35.txt');
var wordlist35a = require('./scowl/english-abbreviations.35.txt');
var wordlist35can = require('./scowl/canadian-words.35.txt');
var wordlist35p = require('./scowl/english-proper-names.35.txt');
var wordlist40 = require('./scowl/english-words.40.txt');
var wordlist40u = require('./scowl/english-upper.40.txt');
var wordlist40c = require('./scowl/english-contractions.40.txt');
var wordlist40a = require('./scowl/english-abbreviations.40.txt');
var wordlist40can = require('./scowl/canadian-words.40.txt');
var wordlist40p = require('./scowl/english-proper-names.40.txt');
var wordlist50 = require('./scowl/english-words.50.txt');
var wordlist50u = require('./scowl/english-upper.50.txt');
var wordlist50c = require('./scowl/english-contractions.50.txt');
var wordlist50a = require('./scowl/english-abbreviations.50.txt');
var wordlist50can = require('./scowl/canadian-words.50.txt');
var wordlist50p = require('./scowl/english-proper-names.50.txt');
var wordlist55 = require('./scowl/english-words.55.txt');
var wordlist55a = require('./scowl/english-abbreviations.55.txt');
var wordlist55can = require('./scowl/canadian-words.55.txt');
var wordlist60 = require('./scowl/english-words.60.txt');
var wordlist60u = require('./scowl/english-upper.60.txt');
var wordlist60c = require('./scowl/english-contractions.60.txt');
var wordlist60a = require('./scowl/english-abbreviations.60.txt');
var wordlist60can = require('./scowl/canadian-words.60.txt');
var wordlist60p = require('./scowl/english-proper-names.60.txt');
var wordlist70 = require('./scowl/english-words.70.txt');
var wordlist80 = require('./scowl/english-words.80.txt');
var wordlist95 = require('./scowl/english-words.95.txt');
var profane1 = require('./scowl/profane.1.txt');
var profane3 = require('./scowl/profane.3.txt');
var moreWords = require('word-list/words.txt');

var createUniqueFn = function() {
  var seen = {};
  return function (word) { return word && (seen.hasOwnProperty(word) ? false : (seen[word] = true)); };
};

var wordsByFrequencyArray = wordsByFrequency.split('\n');
var words = [
  ...wordsByFrequencyArray.slice(0, wordsByFrequencyArray.length / 2),
  ...wordlist10.split('\n'),
  ...wordlist10u.split('\n'),
  ...wordlist10c.split('\n'),
  ...wordlist10a.split('\n'),
  ...wordlist10can.split('\n'),
  ...wordlist20.split('\n'),
  ...wordlist20a.split('\n'),
  ...wordlist20can.split('\n'),
  ...wordlist35.split('\n'),
  ...wordlist35u.split('\n'),
  ...wordlist35c.split('\n'),
  ...wordlist35a.split('\n'),
  ...wordlist35can.split('\n'),
  ...wordlist35p.split('\n'),
  ...wordlist40.split('\n'),
  ...wordlist40u.split('\n'),
  ...wordlist40c.split('\n'),
  ...wordlist40a.split('\n'),
  ...wordlist40can.split('\n'),
  ...wordlist40p.split('\n'),
  ...wordlist50.split('\n'),
  ...wordlist50u.split('\n'),
  ...wordlist50c.split('\n'),
  ...wordlist50a.split('\n'),
  ...wordlist50can.split('\n'),
  ...wordlist50p.split('\n'),
  ...wordlist55.split('\n'),
  ...wordlist55a.split('\n'),
  ...wordlist55can.split('\n'),
  ...wordlist60.split('\n'),
  ...wordlist60u.split('\n'),
  ...wordlist60c.split('\n'),
  ...wordlist60a.split('\n'),
  ...wordlist60can.split('\n'),
  ...wordlist60p.split('\n'),
  ...wordlist70.split('\n'),
  ...wordlist80.split('\n'),
  ...wordlist95.split('\n'),
  ...wordsByFrequencyArray.slice(wordsByFrequencyArray.length / 2),
  ...moreWords.split('\n'),
  ...profane1.split('\n'),
  ...profane3.split('\n'),
]
  .filter(createUniqueFn())
  .filter(function (word) {
    return /^[a-zA-Z'-]*$/.test(word);  // Reject anything with accents etc.
  });

console.log('We have ' + words.length + ' words.');

var idx = 0;
async function fillCard () {
  var oldIdx = idx;
  idx += Math.floor(words.length / 500);
  console.log("Creating directories up to " + Math.floor((idx / words.length) * 10000) / 100 + "%");

  await Promise.all(words.slice(oldIdx, idx).map(async function(word, frequency) {
    var path = './' + word.toLowerCase().split('').join('/');
    await fs.mkdir(path, { recursive: true });
    await fs.writeFile(path + '/w.f', word + '.' + oldIdx + frequency);
  }));

  console.log('Done that chunk!');

  if (idx < words.length) setTimeout(fillCard, 200);
}

fillCard();
