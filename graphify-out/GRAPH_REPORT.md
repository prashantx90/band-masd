# Graph Report - band-masd  (2026-06-17)

## Corpus Check
- 19 files · ~81,035 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 132 nodes · 113 edges · 26 communities (20 shown, 6 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5cb06c6c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]

## God Nodes (most connected - your core abstractions)
1. `7. User Journey` - 9 edges
2. `Team Structure` - 8 edges
3. `Technical Milestones` - 8 edges
4. `5. Agent Architecture` - 8 edges
5. `3. Product Overview` - 4 edges
6. `11. Success Metrics` - 4 edges
7. `AI Session Summary` - 4 edges
8. `AI Session Summary` - 4 edges
9. `8. MVP Scope` - 3 edges
10. `AI Recommendations` - 3 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Communities (26 total, 6 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.13
Nodes (15): Backend Lead & Band Integration Owner, Core Agent Developer, DevOps, Documentation & Demo Lead, Frontend Lead, Product Lead & PM Agent Owner, Review Agent Developer, System Architect & Architect Agent Owner, Team Member 1 (+7 more)

### Community 1 - "Community 1"
Cohesion: 0.09
Nodes (22): 10. Technical Architecture, 11. Success Metrics, 12. Future Roadmap, 13. Hackathon Judging Alignment, 1. Vision, 2. Problem Statement, 3. Product Overview, 4. Core Concept (+14 more)

### Community 2 - "Community 2"
Cohesion: 0.22
Nodes (9): 7. User Journey, Step 1, Step 2, Step 3, Step 4, Step 5, Step 6, Step 7 (+1 more)

### Community 3 - "Community 3"
Cohesion: 0.25
Nodes (7): CodeBand AI, Demo Flow, Hackathon Execution Plan & Task Breakdown, Judging Checklist, MVP Definition, Objective, Stretch Goals

### Community 4 - "Community 4"
Cohesion: 0.25
Nodes (8): Day 1, Day 2, Day 3, Day 4, Day 5, Day 6, Day 7, Technical Milestones

### Community 5 - "Community 5"
Cohesion: 0.25
Nodes (8): 5. Agent Architecture, Architect Agent, Documentation Agent, Engineer Agent, Product Manager Agent, QA Agent, Reviewer Agent, Security Agent

### Community 6 - "Community 6"
Cohesion: 0.17
Nodes (11): code:mermaid (flowchart LR), Context, Decisions Made, Files Changed, Metadata, Next Steps, Objective, Open Questions (+3 more)

### Community 7 - "Community 7"
Cohesion: 0.17
Nodes (11): code:mermaid (flowchart LR), Context, Decisions Made, Files Changed, Metadata, Next Steps, Objective, Open Questions (+3 more)

### Community 22 - "Community 22"
Cohesion: 0.33
Nodes (6): AI Recommendations, AI Session Summary, Prompts Summary, Recommendation 1, Recommendation 2, Tools Used

### Community 23 - "Community 23"
Cohesion: 0.33
Nodes (6): AI Recommendations, AI Session Summary, Prompts Summary, Recommendation 1, Recommendation 2, Tools Used

## Knowledge Gaps
- **84 isolated node(s):** `PreToolUse`, `graphify`, `tasks`, `graphify`, `tasks` (+79 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Team Structure` connect `Community 0` to `Community 3`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **Why does `7. User Journey` connect `Community 2` to `Community 1`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **Why does `5. Agent Architecture` connect `Community 5` to `Community 1`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **What connects `PreToolUse`, `graphify`, `tasks` to the rest of the system?**
  _84 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.13 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.09 - nodes in this community are weakly interconnected._