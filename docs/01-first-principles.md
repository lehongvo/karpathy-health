# 01 — First Principles

Seven principles that survive expert cross-check. Every principle has ≥2 independent sources. Where popular claims don't survive scrutiny, they're flagged.

---

## 1. Sleep is a performance enhancer, not a tax

**Claim**: Below 7h sleep average, your cognitive performance degrades measurably and *you don't notice*.

- Van Dongen et al. (2003): 14 nights of 6h time-in-bed = PVT (psychomotor vigilance task) impairment equivalent to **2 nights of total sleep deprivation**, with subjects rating their own alertness as fine. ([PubMed 12683469](https://pubmed.ncbi.nlm.nih.gov/12683469/), [PDF](https://www.med.upenn.edu/uep/assets/user-content/documents/Van_Dongen_Dinges_Sleep_26_3_2003.pdf))
- Belenky et al. (2003): 7-day dose-response (3/5/7/9h TIB) — PVT lapses scale monotonically with sleep restriction. ([PubMed 12603781](https://pubmed.ncbi.nlm.nih.gov/12603781/))
- Lim & Dinges (2010) meta-analysis (147 tests, n=5104): largest effects on simple-attention lapses (g = 0.78). ([PubMed 20438143](https://pubmed.ncbi.nlm.nih.gov/20438143/))
- **Dev-specific**: Fucci et al. (2018) — one night of sleep deprivation reduced novice developers' implementation quality by ~50% in test-first development. ([arXiv](https://arxiv.org/abs/1805.02544))

**What we DON'T cite**: Matthew Walker's "&lt;7h doubles cancer risk" — not supported by the underlying data, see [Guzey](https://guzey.com/books/why-we-sleep/) and [Gelman](https://statmodeling.stat.columbia.edu/2019/11/18/is-matthew-walkers-why-we-sleep-riddled-with-scientific-and-factual-errors/).

**Operational rule**: Hit 7h ≥5/7 nights. If 3 consecutive nights &lt;6h → cancel optional commitments.

---

## 2. Deep work compounds; shallow work doesn't

**Claim**: Distraction-free, cognitively demanding work is what produces career-defining output. Email/Slack/meeting hours feel productive but rarely move the needle.

- Cal Newport: ["Deep work is professional activities performed in a state of distraction-free concentration that push your cognitive capabilities to their limit."](https://calnewport.com/talk-to-your-boss-about-deep-work/) The deep-vs-shallow ratio should be negotiated and measured.
- Newport on planning: [every minute of your work day blocked](https://calnewport.com/deep-habits-the-importance-of-planning-every-minute-of-your-work-day/).
- Paul Graham, [*Maker's Schedule, Manager's Schedule*](https://paulgraham.com/makersschedule.html): "When you're operating on the maker's schedule, meetings are a disaster."
- Karpathy on PhDs: a PhD is ~10,400 hours of focused work — [karpathy.github.io/2016/09/07/phd/](http://karpathy.github.io/2016/09/07/phd/).

**Operational rule**: ≥1 deep work block of 90-120 min before noon, 4-5 days/week. Slack/email batched twice daily.

---

## 3. Context switching is expensive — protect the block

**Claim**: Switching tasks under time pressure leaves "attention residue" that degrades the next task; in office settings, post-interruption resumption averages ~23 minutes.

- Sophie Leroy (2009): ["Why is it so hard to do my work?"](https://www.sciencedirect.com/science/article/abs/pii/S0749597809000399) — measurable performance decrement on Task B when switching from incomplete Task A under time pressure. DOI: [10.1016/j.obhdp.2009.04.002](https://doi.org/10.1016/j.obhdp.2009.04.002).
- Mark, Gudith & Klocke (2008), CHI: ["The Cost of Interrupted Work: More Speed and Stress."](https://ics.uci.edu/~gmark/chi08-mark.pdf) Average ~23 min 15 s to resume the originally interrupted task.
- Rubinstein, Meyer & Evans (2001): switch costs of several hundred ms per switch in lab tasks. ([PubMed 11518143](https://pubmed.ncbi.nlm.nih.gov/11518143/))

**Flagged**: The popular "20-40% productivity loss" attributed to Leroy is **not** in the original paper. The "23 minutes" is from one ethnographic study (n=24), not independently replicated with that exact figure. Order-of-magnitude only.

**Operational rule**: One project per deep block. Notifications off. Slack opens logged.

---

## 4. Energy > time

**Claim**: Hours-on-keyboard is a vanity metric. Effective output is hours × cognitive capacity, and capacity is governed by sleep, exercise, light, caffeine timing.

- DORA *State of DevOps Report 2024*: stable team priorities → ~40% less burnout; *unstable* priorities + frequent shifts → 90% of teams report productivity drops. Hours don't predict throughput. ([dora.dev](https://dora.dev/research/2024/dora-report/))
- Erickson et al. (2011, PNAS): 12 months × 3 walks/week of moderate aerobic = +2% hippocampal volume in older adults; correlated with serum BDNF. ([PNAS](https://www.pnas.org/doi/10.1073/pnas.1015950108))
- Northey et al. (2018, BJSM): meta-analysis of 39 studies, exercise → cognition pooled g = 0.29 (95% CI 0.17-0.41). ([PubMed 28438770](https://pubmed.ncbi.nlm.nih.gov/28438770/))

**Operational rule**: 3×/week aerobic Zone-2 (40 min). Track *energy* alongside hours.

---

## 5. Compounding beats burst

**Claim**: 1 hour/day for 365 days >> 12 hours once a quarter. Skill, code, and reputation all compound.

- Naval: ["Play long-term games with long-term people. All returns in life... come from compound interest."](https://x.com/naval/status/1109704032204009473) Long-form: [nav.al/long-term](https://nav.al/long-term).
- Karpathy: a PhD = 10,400 hours of consistent focus, not bursts. ([2016 essay](http://karpathy.github.io/2016/09/07/phd/))
- Andy Matuschak on durable learning: spaced repetition + atomic notes accumulate over years; book-reading without retrieval = entertainment. ([andymatuschak.org/books](https://andymatuschak.org/books/), [notes.andymatuschak.org/Evergreen_notes](https://notes.andymatuschak.org/Evergreen_notes))

**Operational rule**: Daily Rust hours streak > monthly heroics. Spaced repetition for new concepts.

---

## 6. Saying no is the highest-leverage skill

**Claim**: Every yes is a no to deep work somewhere else. The cost is invisible because the alternative deep block never happened.

- Naval on optionality and long-term games: see source above.
- DHH, [*It Doesn't Have to Be Crazy at Work*](https://www.amazon.com/Doesnt-Have-Be-Crazy-Work/dp/0062874780) (2018): "Calm is about 40 hours of work a week. Calm is reasonable expectations." Plus ["ASAP is poison"](https://x.com/dhh/status/584745462445518848).
- Newport on the deep-vs-shallow ratio: every shallow yes implicitly trades against the deep ratio target. ([calnewport.com](https://calnewport.com/talk-to-your-boss-about-deep-work/))

**Operational rule**: Max 2 active projects (see `tasks` page). Log every "no" (it builds the muscle).

---

## 7. Only build what compounds (anti-fragile output)

**Claim**: Time spent on artifacts that survive — open source, writing, evergreen notes, code in production — has compounding returns. Time spent on Slack/Zoom/inbox does not.

- Naval on leverage: code & media are *permissionless* leverage; the others are not. ([Almanack PDF](https://navalmanack.s3.amazonaws.com/Eric-Jorgenson_The-Almanack-of-Naval-Ravikant_Final.pdf))
- Matuschak on "evergreen notes" — written and organized to evolve over time. ([source](https://notes.andymatuschak.org/Evergreen_notes))
- Karpathy: his entire public reputation is downstream of writing + open-source code, not meetings. ([karpathy.github.io](http://karpathy.github.io))

**Operational rule**: Each week, ship at least one *artifact* — a commit in a public repo, a written note, a measurable result. Calls don't count.

---

## What we deliberately rejected

| Rejected principle | Why |
|---|---|
| "Cold showers boost focus" | [Muller 2021 SR](https://pmc.ncbi.nlm.nih.gov/articles/PMC8470111/) — 9/10 studies show impaired cognition. Mood lift only. |
| "Blue light glasses save your sleep" | [Cochrane 2023](https://academic.oup.com/sleepadvances/article/1/1/zpaa002/5851240) — inconclusive. Content/interactivity matters more than wavelength. |
| "10,000 hours = expert" | Karpathy uses it as a heuristic, not a law. Originating Ericsson research has been contested by multiple meta-analyses. |
| "Track everything (calories, mood/hour, HRV…)" | No evidence this improves outcomes for non-elite devs. Adds cognitive load. |
| "Hustle till you exit" | DORA 2024 + Tulili 2023 — burnout is the modal outcome, not exit. |

---

Read next: [`02-energy-protocol.md`](./02-energy-protocol.md)
