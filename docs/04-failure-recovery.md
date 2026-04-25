# 04 — Failure Recovery Protocols

You will fail at this system. The question is **how fast you recover**, not whether you fail. Five common failure modes for a multi-job dev. Each has a defined exit ramp.

---

## Failure mode 1: Sleep debt accumulating (3+ nights &lt;6h)

**Detection**: BurnoutAlert in the dashboard fires. Manually: average TIB last 3 nights < 6h.

**Why it matters**: Per Van Dongen 2003, this is when you start performing like a sleep-deprived person *while feeling fine*. Decisions degrade. Bugs multiply. Interviews tank.

**Recovery (3-day protocol)**:

- **Day 1**: cancel optional commitments tonight. In bed by 21:30. Aim 8.5h TIB. No alcohol, no caffeine after 12:00.
- **Day 2**: 30-min outdoor light walk before 09:00. Same caffeine + bedtime rules. No deep work demands >2h.
- **Day 3**: resume normal. If still feeling impaired, go to 4 days.

**What does NOT work**: "sleeping in on the weekend." Belenky 2003 showed recovery is partial; you can't fully repay 5×6h with 1×10h.

---

## Failure mode 2: Exercise lapse (5+ days no movement)

**Detection**: BurnoutAlert + manual: 0 logged sessions in 5 days.

**Why it matters**: BDNF expression drops. Mood drops. Sleep quality drops. The cycle compounds.

**Recovery (7-day protocol)**:

- **Day 1**: 20-min walk. That's it. Don't try to "make up" — counterproductive.
- **Day 3**: 30-min Zone-2 (conversational pace, jog or fast walk).
- **Day 5**: 40-min Zone-2.
- **Day 7**: resume normal 3×/week schedule.

**Rule**: don't double the volume. You'll get hurt and quit. Restart at 50% and ramp.

---

## Failure mode 3: Deep work collapse (>50% drop vs baseline)

**Detection**: rolling 7-day deep work hours < 50% of last 28-day average (auto-detected in `analytics.ts`).

**Why it matters**: Means you're being captured by shallow work. Will tank your Rust progress and interview readiness.

**Recovery (1-week protocol)**:

- **Audit**: open the dashboard, look at the last 7 days. Where did the hours go?
  - Meetings? → cap at 2/day, ruthlessly decline the rest.
  - Slack? → set notification hygiene from `03-attention-protocol.md`.
  - Context-switching between jobs? → pick ONE day per job per week minimum.
- **Restart**: schedule ONE 90-min block tomorrow, before noon. One project. Notifications off. Just hit "start" on the timer.
- **Don't try to immediately get back to 4 blocks/day.** One block tomorrow > zero blocks "until I'm ready."

---

## Failure mode 4: Multi-project overload (>2 active)

**Detection**: ProjectStatusBoard shows >2 in "Active" column.

**Why it matters**: Pure context-switching tax (Mark 2008). Every project in flight steals time from every other.

**Recovery (1-day protocol)**:

- **Today**: open the board, force one project from Active → Maintenance or Paused.
- **Define "Maintenance"**: 30 min/week, just enough to not die. No new features.
- **Define "Paused"**: 0 min. Will resume after current Active ships.
- **Communicate the pause** to the project's stakeholders. The lie of "I'll get to it" is the worst path.

---

## Failure mode 5: Interview-prep crunch / job switch panic

**Detection**: subjective — "I need to ramp interview prep AND keep my full-time job from falling apart."

**Why it matters**: this is exactly when burnout happens. The Solana/Rust remote-job goal is the bigger context here (per memory). Don't lose the long game to short-term panic.

**Recovery (4-week protocol)**:

- **Week 1**: drop ALL maintenance projects to "paused." Down to 1 active (full-time job) + 1 active (interview prep).
- **Daily**: 90 min interview prep before work; 90 min deep work for full-time job. Total deep work = 3h. That's enough. Stop reading "10 hours/day grinding LeetCode" advice — it's signaling, not strategy.
- **Sleep is non-negotiable**. 7h minimum. Skip evenings out. Skip "one more LeetCode." This is a 4-week sprint, not 4 months.
- **Weekly**: review applications sent, interviews scheduled. If nothing's happening after 3 weeks, the bottleneck isn't more grinding — it's resume/networking.
- **Week 4 review**: pivot or continue.

---

## Meta-rule: 3-strikes recovery

If you fail 3 different recovery protocols in the same 4-week period:
1. **Stop adding things.** Strip your active projects to 1.
2. **Delete habits, don't add them.** Pick the 5 from `06-tldr.md`. Drop everything else.
3. **Write a decision-log entry** (`decision-log.md`) — what's the actual constraint? Burnout? Misalignment? Health issue?
4. Consider whether you need a real off-week (no work, no learning, just rest). Rare but sometimes necessary.

---

## What's NOT a failure mode

- One bad day. Anyone can have one. Don't over-correct.
- One missed deep work block. The system is designed for ≥4 blocks/week, not 7/7.
- One late-night Slack reply. Just don't make it daily.
- Skipping a Sunday review once. Catch it next week.

The failure isn't the slip. The failure is letting the slip compound for a week without noticing.

---

Read next: [`05-anti-patterns.md`](./05-anti-patterns.md)
