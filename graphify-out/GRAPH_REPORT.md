# Graph Report - villain-card  (2026-06-12)

## Corpus Check
- 27 files · ~7,039 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 147 nodes · 181 edges · 12 communities (11 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4df931ef`
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
- [[_COMMUNITY_Community 11|Community 11]]

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 17 edges
2. `compilerOptions` - 16 edges
3. `PixelImp()` - 6 edges
4. `scripts` - 5 edges
5. `SectionSlash()` - 4 edges
6. `profile` - 4 edges
7. `Dossier()` - 3 edges
8. `SocialLink` - 3 edges
9. `links` - 3 edges
10. `AmbientBackground()` - 2 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (12 total, 1 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.15
Nodes (10): AmbientBackground(), Footer(), profile, DeckSection(), EASE, HeroV2(), Lightning(), LightningProps (+2 more)

### Community 1 - "Community 1"
Cohesion: 0.11
Nodes (18): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection, moduleResolution (+10 more)

### Community 2 - "Community 2"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, moduleResolution, noEmit (+9 more)

### Community 3 - "Community 3"
Cohesion: 0.16
Nodes (12): Dossier(), EASE, fadeUp(), dossier, SectionSlash(), BARS, EASE, RedactedBars() (+4 more)

### Community 4 - "Community 4"
Cohesion: 0.15
Nodes (16): Activity, ACTIVITY_BY_IDX, BLINK, BODY, BODY_PIXELS, C, laptopFrame(), phoneFrame() (+8 more)

### Community 5 - "Community 5"
Cohesion: 0.15
Nodes (10): EASE, Icon(), IconProps, paths, EASE, Achievement, DossierProject, IconName (+2 more)

### Community 6 - "Community 6"
Cohesion: 0.14
Nodes (13): dependencies, framer-motion, react, react-dom, name, private, scripts, build (+5 more)

### Community 7 - "Community 7"
Cohesion: 0.15
Nodes (13): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, @types/node, @types/react (+5 more)

### Community 11 - "Community 11"
Cohesion: 0.29
Nodes (5): EASE, Schemes(), Scheme, schemes, SectionFX()

## Knowledge Gaps
- **84 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+79 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `Community 7` to `Community 6`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _84 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.14619883040935672 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Should `Community 4` be split into smaller, more focused modules?**
  _Cohesion score 0.14705882352941177 - nodes in this community are weakly interconnected._
- **Should `Community 6` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._