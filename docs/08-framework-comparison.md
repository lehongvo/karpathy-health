# 08 — Framework Comparison

Eight popular productivity systems. Honest comparison. **Recommended stack at the end.**

---

## Comparison table

| Framework | Source | Core idea | Strength | Weakness | Best for |
|---|---|---|---|---|---|
| **Deep Work** | [Cal Newport, *Deep Work* (2016)](https://calnewport.com/talk-to-your-boss-about-deep-work/) | Schedule distraction-free blocks; measure deep-vs-shallow ratio | Strong evidence base; matches dev-output economics | Doesn't address task capture or multi-project orchestration | Knowledge workers, devs, writers, researchers |
| **Time Blocking** | [Newport: plan every minute](https://calnewport.com/deep-habits-the-importance-of-planning-every-minute-of-your-work-day/) | Every minute of the day pre-assigned | Forces saying-no; prevents drift | High overhead; brittle to interruptions | People with chaotic calendars (consultants, managers) |
| **GTD** | [David Allen, *Getting Things Done*](https://gettingthingsdone.com) | Capture → clarify → organize → reflect → engage | Excellent for inbox/task overflow | Heavy ritual; can become productivity porn | People drowning in commitments |
| **PARA** | [Tiago Forte](https://fortelabs.com/blog/para/) | Sort by Project / Area / Resource / Archive | Simple, durable taxonomy | No measured productivity benefit (testimonial only) | Knowledge management ("second brain") |
| **Pomodoro** | [Francesco Cirillo](https://francescocirillo.com/pages/pomodoro-technique) | 25 min work / 5 min break | Easy to start; good for procrastination | 25 min too short for hard cognitive work | Restarting after slumps |
| **Maker's Schedule** | [Paul Graham (2009)](https://paulgraham.com/makersschedule.html) | Half-day blocks; meetings only at edges | Aligns with how cognition actually works for makers | Hard to implement when working with managers | Devs, writers — solo or maker-heavy teams |
| **Karpathy Mode** | [Karpathy's writing](http://karpathy.github.io/2016/09/07/phd/) + [Lex Fridman #333](https://lexfridman.com/andrej-karpathy/) | Saturate yourself in one problem for days/weeks | Highest cognitive depth | Not sustainable as a daily mode; requires zero context-switching | Sprints (1-2 wks/quarter), dissertation-grade problems |
| **Bullet Journal** | [Ryder Carroll](https://bulletjournal.com) | Analog notebook with rapid-logging | Forces handwriting reflection; offline | High overhead; poor for digital-native devs | People who think better with pen + paper |

---

## Recommended stack (for a multi-job dev)

You don't need all 8. Pick **2-3** that compose well. Recommendation:

### Core (mandatory): **Deep Work + Maker's Schedule**

- These are complementary: Deep Work tells you *what* to do (90+ min uninterrupted blocks); Maker's Schedule tells you *when* to do it (mornings, no mid-day meetings).
- Together: ≥1 deep work block per day, mornings, no fragmentation.

### Layer 2 (recommended): **Light time-blocking**

- Not "every minute of the day" — that's brittle.
- Just block: deep work, exercise, weekly review.
- Use the calendar as defense against ambient interruptions.

### Layer 3 (optional): **Karpathy mode for milestones**

- 1-2 weeks/quarter, when you have a defined deliverable (Solana milestone, interview prep sprint).
- Not a daily mode. Ratio: ~5-10% of your year.

---

## What we explicitly drop

- **GTD**: too much ritual for a solo dev. The capture habit is good (we use a simple inbox in `/tasks`), but the full GTD weekly process is overkill.
- **PARA**: no measured productivity benefit; testimonial-grade evidence only. Useful as a *file-organization* heuristic, not a productivity system.
- **Pomodoro as default**: see [`05-anti-patterns.md`](./05-anti-patterns.md) #6. Use 90/15 instead.
- **Bullet Journal**: digital-first beats analog for a dev whose tools are already digital.

---

## Why "stack 2-3" not "use them all"

Per Karpathy guideline #2 (Simplicity First) and `00-philosophy.md`:

- Each framework adds friction.
- Compound friction → system abandonment within 4-8 weeks.
- **The system you use is better than the system you don't.**

Deep Work + Maker's Schedule + light time-blocking is enough to run for years.

---

Read next: [`cadence.md`](./cadence.md)
