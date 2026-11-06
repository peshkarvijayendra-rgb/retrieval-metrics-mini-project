# Evaluation Results & Findings

## Comparison Table

| Query | Keyword rank | Semantic rank |
|---|---|---|
| my redis cache keeps showing old data | 8 | 1 |
| how do I add semantic search to a table I already have | miss | 2 |
| redis or memcached for caching | 1 | 2 |
| why did my query get slower after I added an index | miss | 1 |
| what does ACID actually guarantee | 2 | 1 |
| how do I keep my postgres online while changing the schema | 6 | 3 |
| my background jobs stop after every deploy | miss | 2 |
| how do I let my database accept more writes per second | 4 | 1 |
| sql or nosql for a new product | 1 | 3 |
| why does my redis memory keep climbing | miss | 2 |
| **Summary** | **MRR 0.30 · Recall@10 0.60** | **MRR 0.67 · Recall@10 1.00** |

## Metric Definitions

- **Reciprocal Rank (RR):** $1 / \text{rank}$ of the first correct answer in top-$k$, or $0$ if not found.
- **Mean Reciprocal Rank (MRR):** The average RR across all test queries ($\frac{1}{N} \sum_{i=1}^N \text{RR}_i$).
- **Recall@k:** The fraction of queries where at least one correct answer appeared within the top-$k$ results ($\frac{\text{hits}}{N}$).

## Interpretation

Overall, semantic search significantly outperforms keyword search across both metrics, delivering an MRR of 0.67 compared to 0.30 and achieving a perfect Recall@10 of 1.00 compared to 0.60. Keyword search specifically won on queries with distinct technical names and head-to-head architectural comparisons, namely `"redis or memcached for caching"` (rank 1 vs. 2) and `"sql or nosql for a new product"` (rank 1 vs. 3). These keyword-winning queries share a reliance on precise, well-defined domain terms where exact lexical token matching provides an unambiguous signal. In contrast, semantic search dominated queries describing troubleshooting symptoms, operational issues, and conceptual goals—such as `"my redis cache keeps showing old data"`, `"why did my query get slower after I added an index"`, and `"my background jobs stop after every deploy"`—where the query wording articulates a problem without necessarily reusing the document's exact vocabulary. A team would still keep the keyword search system around because the two search strategies win on distinct query types; combining both into a hybrid search architecture (e.g., BM25 + dense vector embeddings with Reciprocal Rank Fusion) leverages the strengths of both without suffering from either's blind spots.
