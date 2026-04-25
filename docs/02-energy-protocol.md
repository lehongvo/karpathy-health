# 02 — Energy Protocol (Layer 1)

Sleep, exercise, nutrition. Hard rules with citations. If a popular practice isn't here, it's because the evidence didn't survive cross-check.

---

## A. Sleep

### Hard rules

| Rule | Threshold | Source |
|---|---|---|
| Minimum sleep | **7h** time-in-bed (TIB), ≥5 nights/week | Van Dongen et al. 2003 ([PubMed](https://pubmed.ncbi.nlm.nih.gov/12683469/)) |
| Caffeine cutoff | **8h before intended bedtime** for normal metabolizers; 12h if you're a slow metabolizer | Drake et al. 2013 ([PMC3805807](https://pmc.ncbi.nlm.nih.gov/articles/PMC3805807/)) |
| Light anchor | **10-30 min outdoor sunlight within 1h of waking** | Wright et al. 2013 ([PMC4020279](https://pmc.ncbi.nlm.nih.gov/articles/PMC4020279/)) |
| Screen rule | Static reading after dark = OK; interactive (Twitter/Slack/games) = stops your sleep | Chang et al. 2015 ([PNAS](https://pubmed.ncbi.nlm.nih.gov/25535358/)) + nuance from [Singh 2024](https://academic.oup.com/sleepadvances/article/1/1/zpaa002/5851240) |
| Failure threshold | 3 consecutive nights &lt;6h → cancel optional commits, see `04-failure-recovery.md` | Belenky et al. 2003 ([PubMed](https://pubmed.ncbi.nlm.nih.gov/12603781/)) |

### Why these specific numbers

- **7h, not 8h**: 8h is the population recommendation; 7h is the floor below which Van Dongen showed reliable cognitive degradation in the average healthy adult. Hit 7h. Aim for 7.5-8h. Don't moralize about it.
- **Caffeine half-life is 5h average, range 1.5-9.5h** ([NCBI Bookshelf NBK223808](https://www.ncbi.nlm.nih.gov/books/NBK223808/)). 200mg coffee at 14:00 → ~100mg at 19:00 → ~50mg at midnight if you're average. **Slow metabolizers (~10-15% of whites)** carry twice the load — if you wake un-rested, suspect caffeine first.
- **Drake 2013**: 400mg caffeine taken 6h before bed reduced total sleep by >1 hour (n=12, within-subject design). The 6h "cutoff" rule is too generous for many; we use 8h to be safe.
- **Light is the strongest circadian signal**. Outdoor cloudy day ≈ 10,000 lux; indoor office ≈ 100-500 lux. The Huberman "10 min outside" rule is a heuristic; the underlying peer-reviewed dose-response is from Khalsa et al. 2003 ([PMC2342968](https://pmc.ncbi.nlm.nih.gov/articles/PMC2342968/)) and Wright 2013. Skip the SAD lamp unless you literally cannot get outside.

### What we explicitly de-emphasize

- **Tracking sleep stages** (deep/REM percentages from a watch). Useful as a directional gut-check, but consumer wearables are noisy. Track *hours* and *consistency* — they're what move the needle.
- **Walker's "&lt;7h doubles cancer risk"**: not supported by underlying data ([Guzey 2019](https://guzey.com/books/why-we-sleep/), [Gelman](https://statmodeling.stat.columbia.edu/2019/11/18/is-matthew-walkers-why-we-sleep-riddled-with-scientific-and-factual-errors/)). Use the general "chronic short sleep impairs cognition" claim instead — it's well-supported by Van Dongen, Belenky, Lim/Dinges.

---

## B. Exercise

### Hard rules

| Rule | Threshold | Source |
|---|---|---|
| Aerobic | **3×/week × 40 min Zone-2** (HR ~65-75% max, conversational pace) | Erickson et al. 2011 ([PNAS](https://www.pnas.org/doi/10.1073/pnas.1015950108)) |
| Resistance | 2×/week, full-body, compound lifts | Liu-Ambrose 2010 ([JAMA](https://jamanetwork.com/journals/jamainternalmedicine/fullarticle/415534)) |
| Daily floor | **>7000 steps**, even on rest days | General epidemiological consensus |
| Failure threshold | 5 days no exercise → "Recovery Sprint" (see `04-failure-recovery.md`) | Northey 2018 meta-analysis ([PubMed](https://pubmed.ncbi.nlm.nih.gov/28438770/)) |

### Why these specific numbers

- **Erickson 2011 (PNAS)**: 12 months of 40-min walks 3×/week → +2% anterior hippocampal volume in older adults, correlated with serum BDNF. Effect modestly extrapolates to younger devs.
- **Northey 2018 BJSM meta-analysis**: pooled g = 0.29 (95% CI 0.17-0.41) for exercise → cognition in adults >50, both aerobic AND resistance significant. Effect smaller than sleep restriction's, but real.
- **Wilckens 2021 meta-analysis** confirms hippocampal volume preservation across studies ([PMC11497212](https://pmc.ncbi.nlm.nih.gov/articles/PMC11497212/)).

### What we don't claim

- **Pre-workout supplements / creatine for cognition** — creatine has *some* evidence for cognition under sleep deprivation, but as a daily protocol for a healthy dev, the marginal benefit is unclear.
- **HIIT > Zone-2 for cognition** — HIIT has metabolic advantages, but for cognitive benefit, consistent Zone-2 is the better-evidenced protocol. Don't optimize for the wrong outcome.
- **"Morning workout is best"** — timing matters less than consistency. Most studies don't isolate timing as the variable.

---

## C. Nutrition (lite — no calorie counting)

We track **3 things only**:

1. **Last caffeine timestamp** — auto-flags violation of the 8h-before-bed rule.
2. **Hydration count** — glasses per day. Target: 8.
3. **Late meal flag** — if eating ≥3h before sleep, no flag. Otherwise flag (poor sleep predictor in many cohort studies — modest effect, but free to track).

### What we don't track

- **Calorie totals.** Counter-productive for non-cut-focused devs. Adds friction. If you need to lose weight, see a registered dietitian, not a productivity app.
- **Macros (P/F/C ratios).** Same reason.
- **Mood per meal.** Not actionable.

### Eating-window opinion (weak evidence, optional)

- Karpathy mentions a 12-6 PM eating window in interview clips ([Lex Fridman #333](https://lexfridman.com/andrej-karpathy/), [secondary](https://glasp.co/youtube/p/day-in-the-life-of-andrej-karpathy-lex-fridman-podcast-clips)). Time-restricted eating (TRE) has *some* evidence for metabolic markers but mixed evidence for cognitive performance.
- **Verdict**: try if curious; do not adopt as a hard rule. Sleep + caffeine timing have far stronger evidence.

---

## D. The 80/20 of this layer

If you implement nothing else from this protocol:

1. **7h sleep ≥5 nights/week.**
2. **Caffeine cut 8h before bed.**
3. **3×/week 40-min Zone-2 cardio.**
4. **10-30 min outdoor light within 1h of waking.**

Everything else is bonus.

---

Read next: [`03-attention-protocol.md`](./03-attention-protocol.md)
