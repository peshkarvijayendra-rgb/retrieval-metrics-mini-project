// eval.js starter. Fill in the four TODOs, then run: node eval.js
// You should not need any libraries. Plain Node.js is enough.
const fs = require('fs');

// --- 1. Load the inputs (already done for you) -----------------------------
// test-set.csv has a header row, then: query,correct_post_ids
// correct_post_ids may be a semicolon list, e.g. "1024;1025".
function loadTestSet(path) {
  const lines = fs.readFileSync(path, 'utf8').replace(/\r/g, '').trim().split('\n').slice(1);
  return lines.map(line => {
    const [query, ids] = line.split(',');
    return { query, correctIds: ids.split(';').map(Number) };
  });
}
const testSet = loadTestSet('test-set.csv');

// search-results.json maps each query to the top-10 ranked post_id lists that
// each system returned: { "<query>": { keyword: [...], semantic: [...] } }
const results = JSON.parse(fs.readFileSync('search-results.json', 'utf8'));

// --- 2. TODO: Reciprocal Rank ----------------------------------------------
// Return 1 / (rank of the FIRST correct id in rankedIds). Return 0 if none of
// the correct ids appear in rankedIds. Rank is 1-based (first result = rank 1).
function reciprocalRank(rankedIds, correctIds) {
  const rank = rankOf(rankedIds, correctIds);
  return rank !== null ? 1 / rank : 0;
}

// Helper: the 1-based rank of the first correct id, or null if it is a miss.
function rankOf(rankedIds, correctIds) {
  for (let i = 0; i < rankedIds.length; i++) {
    if (correctIds.includes(rankedIds[i])) {
      return i + 1;
    }
  }
  return null;
}

// --- 3. TODO: run the evaluation loop --------------------------------------
// For every query: look up its keyword and semantic ranked lists, compute the
// reciprocal rank of each, accumulate the RRs, and count a "hit" whenever the
// correct answer was found in the top 10 (RR > 0).
// Then compute:
//   keywordMRR, semanticMRR         = average RR across all queries
//   keywordRecall, semanticRecall   = hits / number of queries
const kwRRs = [];
const semRRs = [];
let kwHits = 0;
let semHits = 0;

const tableRows = [];

for (const { query, correctIds } of testSet) {
  const systemResults = results[query];
  const kwRank = rankOf(systemResults.keyword, correctIds);
  const semRank = rankOf(systemResults.semantic, correctIds);

  const kwRR = reciprocalRank(systemResults.keyword, correctIds);
  const semRR = reciprocalRank(systemResults.semantic, correctIds);

  kwRRs.push(kwRR);
  if (kwRR > 0) kwHits++;

  semRRs.push(semRR);
  if (semRR > 0) semHits++;

  tableRows.push({
    query,
    keywordRankStr: kwRank !== null ? String(kwRank) : 'miss',
    semanticRankStr: semRank !== null ? String(semRank) : 'miss',
  });
}

const totalQueries = testSet.length;
const mean = arr => arr.reduce((sum, val) => sum + val, 0) / arr.length;
const keywordMRR = mean(kwRRs);
const semanticMRR = mean(semRRs);
const keywordRecall = kwHits / totalQueries;
const semanticRecall = semHits / totalQueries;

// --- 4. TODO: print a markdown comparison table ----------------------------
// Print one row per query: | query | keyword rank | semantic rank |  (use "miss"
// when the answer was not in the top 10), then a final **Summary** row with
// MRR and Recall@10 for each system, each rounded to 2 decimals.
console.log('| Query | Keyword rank | Semantic rank |');
console.log('|---|---|---|');
for (const row of tableRows) {
  console.log(`| ${row.query} | ${row.keywordRankStr} | ${row.semanticRankStr} |`);
}
console.log(
  `| **Summary** | **MRR ${keywordMRR.toFixed(2)} · Recall@10 ${keywordRecall.toFixed(2)}** | **MRR ${semanticMRR.toFixed(2)} · Recall@10 ${semanticRecall.toFixed(2)}** |`
);
