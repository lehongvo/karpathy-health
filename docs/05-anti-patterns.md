# 05 — Anti-Pattern Hall of Fame

Popular productivity advice that doesn't survive scrutiny. Stop doing these.

---

## 1. "Cold showers / ice baths boost focus"

**The claim**: Daily cold exposure → better cognition, alertness, work output.

**The evidence**: Two systematic reviews converge on **no robust cognitive benefit**.

- Muller et al. 2021 SR (10 studies, n=186): **9 of 10** showed *impaired* cognitive performance during/after cold exposure. ([PMC8470111](https://pmc.ncbi.nlm.nih.gov/articles/PMC8470111/))
- Yankouskaya et al. 2025 PLOS ONE meta-analysis (n=3177): short-term mood/alertness gain at 12h post-exposure, no clear cognitive performance edge. ([PLOS One](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0317615))

**Verdict**: If you enjoy it for mood, fine. As a productivity hack: **not supported**. Don't sell it to others as one.

---

## 2. "Blue light glasses save your sleep"

**The claim**: Wear amber glasses 2h before bed; phone won't disrupt your circadian rhythm.

**The evidence**:

- Cochrane 2023 review of blue-light-blocking glasses: **inconclusive, low certainty**. ([SLEEP Advances meta](https://academic.oup.com/sleepadvances/article/1/1/zpaa002/5851240))
- Recent (2024) sleep-health consensus: content/interactivity matters more than wavelength. Twitter doom-scroll under amber light still wrecks sleep onset. ([NSF 2024 statement](https://www.sleephealthjournal.org/article/S2352-7218(24)00090-1/fulltext))

**Verdict**: Worry about *what you're doing* on the screen at night, not what color it is. Don't buy glasses; close Slack.

---

## 3. "Walker's *Why We Sleep* is the sleep bible"

**The claim**: &lt;7h sleep doubles cancer risk, demolishes immune function, etc.

**The evidence**:

- Alexey Guzey spent 130h fact-checking Chapter 1 alone — found inflated sample sizes, statistical errors, miscited papers. ([guzey.com](https://guzey.com/books/why-we-sleep/))
- Andrew Gelman (Columbia statistics) called the omitted-bar episode potentially "research misconduct" territory. ([Statistical Modeling blog](https://statmodeling.stat.columbia.edu/2019/11/18/is-matthew-walkers-why-we-sleep-riddled-with-scientific-and-factual-errors/))
- Walker's response acknowledged some errors, didn't address most specific points. ([sleepdiplomat blog](https://sleepdiplomat.wordpress.com/2019/12/19/why-we-sleep-responses-to-questions-from-readers/))

**Verdict**: The general claim "chronic short sleep impairs cognition" is rock-solid (Van Dongen, Belenky, Lim/Dinges). Walker's *specific* numerical claims are not. **Cite Van Dongen, not Walker.**

---

## 4. "10,000 hours = expert"

**The claim**: 10,000 hours of practice in any domain produces expertise (per Gladwell's reading of Ericsson).

**The evidence**:

- Original Ericsson research has been re-analyzed (Macnamara et al. 2014 meta-analysis): deliberate practice explains a much smaller fraction of expert performance variance than the popular reading suggests.
- Karpathy himself uses it as a heuristic for PhD-grade depth, not a universal law. ([2016 essay](http://karpathy.github.io/2016/09/07/phd/))

**Verdict**: Useful order-of-magnitude motivation. Don't treat as a quantitative law. Quality of practice >> hour count.

---

## 5. "Track everything (calories, mood/hour, HRV, glucose…)"

**The claim**: More data → better decisions.

**The evidence**:

- No peer-reviewed evidence that micro-tracking improves outcomes for non-elite athletes/devs.
- Adds cognitive load (a tax on the very attention you're trying to protect).
- Wearable HRV/sleep-stage measurements are noisy at consumer grade.

**Verdict**: Track what's actionable: sleep hours, exercise Y/N, deep work hours, MIT done Y/N. **That's enough.**

---

## 6. "Pomodoro (25/5) is the deep work protocol"

**The claim**: Work 25 min, break 5 min, repeat.

**The evidence**: Useful for *restarting after procrastination*, but 25 min is too short for genuinely hard problems. By the time you load context, you're breaking. Use 90/15 (BRAC-aligned).

**Verdict**: Pomodoro is a "get-unstuck" tool, not a daily deep-work protocol.

---

## 7. "Productivity porn on Twitter / YouTube / Reddit"

**The claim**: Spending an hour reading r/productivity, watching YouTube morning routines, optimizing your Notion will make you more productive.

**The evidence**: Cumulative anti-evidence — every minute spent reading about productivity is a minute not spent doing the work. Self-reinforcing distraction loop.

**Verdict**: **Set a hard cap**. 30 min/quarter on productivity content. Then close the tab and use what you have.

---

## 8. "I'll just check Slack quickly during deep work"

**The claim**: One quick Slack check won't hurt.

**The evidence**: Mark 2008 — 23 min average resumption lag. Even if you call it 5 min in your case, multiply by 4 checks per block = 20 min lost.

**Verdict**: **All notifications off during the block.** Period. Slack lives in batched windows.

---

## 9. "Reading more books = learning more"

**The claim**: Read 50 books a year, get 50 books smarter.

**The evidence**: Andy Matuschak — ["Why books don't work"](https://andymatuschak.org/books/) — most non-fiction reading produces no durable memory. Without retrieval, books are entertainment.

**Verdict**: Fewer books, deeper engagement. Spaced repetition for technical concepts. One re-read of the Rust book with exercises >> ten skim-reads.

---

## 10. "Hustle till the exit"

**The claim**: Sustained 80h weeks for 3-5 years → big exit/job/title → freedom.

**The evidence**:

- DORA 2024: hours don't predict throughput; stable priorities + good practices do. ([dora.dev](https://dora.dev/research/2024/dora-report/))
- Tulili et al. 2023 systematic mapping of burnout in SE (n=92 papers): exhaustion → turnover is the modal outcome, not exit. ([ScienceDirect](https://www.sciencedirect.com/science/article/pii/S0950584922002257))
- JetBrains 2023 dev survey: ~73% lifetime burnout prevalence.

**Verdict**: For your specific goal (remote Solana/Rust job), the marginal hour past ~50/week has near-zero return and high burnout cost. Sustain 40-50, ship consistently.

---

## What this doesn't mean

We're not anti-ambition. We're anti-*folklore*. If a popular practice has weak evidence:
- **Maybe try it for 4 weeks**, measure honestly.
- **Don't market it to others** as a universal hack.
- **Drop it without ceremony** if the data doesn't show up.

---

Read next: [`06-tldr.md`](./06-tldr.md)
