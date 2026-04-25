# 03 — Attention Protocol (Layer 2)

The constraint isn't your knowledge of Rust. It's your daily ability to spend 90 uninterrupted minutes on a hard problem.

---

## A. Hard rules

| Rule | Threshold | Source |
|---|---|---|
| Deep work block length | **90-120 min**, ≥1/day, before noon if possible | Newport ([calnewport.com](https://calnewport.com/talk-to-your-boss-about-deep-work/)) + PG Maker's Schedule ([paulgraham.com](https://paulgraham.com/makersschedule.html)) |
| Notifications during deep block | All off (Slack, mail, phone) | Mark/Gudith/Klocke 2008 ([PDF](https://ics.uci.edu/~gmark/chi08-mark.pdf)) |
| Slack/email batching | **2× per day**, 30 min each | Newport, [planning every minute](https://calnewport.com/deep-habits-the-importance-of-planning-every-minute-of-your-work-day/) |
| Meeting cap | ≤2 meetings/day on maker days; 0 if possible | PG Maker's Schedule |
| Single-tasking rule | One project per deep block; no tab-switching | Leroy 2009 ([ScienceDirect](https://www.sciencedirect.com/science/article/abs/pii/S0749597809000399)) |
| Distraction logging | Every Slack/Twitter open during a block — count it | Mark *Attention Span* (2023): screen attention has dropped from ~2.5 min in 2004 to ~47s in 2023 |

---

## B. Anatomy of a deep work block

```
T-15 min: shutdown all notifications, close all unrelated tabs
T-10 min: write the ONE question you'll answer in this block
T-0:     start timer (DeepWorkTimer in this app)
T+90:    timer ends. Stop. Don't push past unless you're in flow.
T+95:    log distraction count + subjective focus 1-5
T+5 min walk before next block
```

**Why 90 min**: BRAC (basic rest-activity cycle) is ~90 min in adults; aligns with ultradian arousal cycles. Cognitive output collapses past 100-120 min without a real break.

**Why before noon**: per the Energy Protocol, your cognitive capacity is highest after a full night's sleep, before glucose and decision fatigue erode it.

---

## C. The "attention residue" problem (and the popular misquote)

**The real claim** (Leroy 2009): Switching from Task A to Task B under time pressure leaves measurable cognitive "residue" from A. Performance on B is degraded.

**The popular misquote**: "Switching tasks costs you 20-40% productivity." This number is **not in the Leroy paper**. It's popular-press extrapolation. The rigorous claim is "measurable decrement under time pressure," not a quantified percentage.

**The Mark 23-minute number**: From [Mark, Gudith & Klocke 2008](https://ics.uci.edu/~gmark/chi08-mark.pdf) — observational field study (n=24) of office workers. Average ~23 min 15 s to resume the original task after an interruption. Useful as order-of-magnitude; not a per-event guarantee.

**Application**: every Slack/Discord/Twitter open during a deep block costs you somewhere between 0.5s (lab) and ~23min (field). Plan for the field number. Batch.

---

## D. Notification hygiene checklist (do this once)

- [ ] **Phone**: Focus mode on during work hours. Notifications: only direct calls + family.
- [ ] **Slack**: notifications off except DMs from manager + @mentions. Mute all channels.
- [ ] **Email**: badge count off. No notification sound.
- [ ] **Browser**: no Twitter/X/LinkedIn tabs open during deep work blocks. Use a separate browser profile if needed.
- [ ] **Calendar**: no notifications for events >15 min away.
- [ ] **VS Code**: extensions like "GitLens" with live notifications off during deep work.
- [ ] **macOS Do Not Disturb**: scheduled 06:00-12:00 daily.

This is a **one-time setup**. The system is brittle: any notification you allow becomes the most likely thing to break your block, by definition.

---

## E. Maker vs Manager day pattern

Per [PG's Maker's Schedule](https://paulgraham.com/makersschedule.html):

- **Maker days**: 1-2 long blocks of deep work. Meetings either before 09:00 or after 16:00, never mid-day. Goal: ship code, write, design.
- **Manager days**: meetings can be batched, but deep work expectations drop. Goal: communicate, unblock, plan.

**Don't pretend a hybrid day works.** A 12:30 meeting on a maker day = no maker day. Reschedule the meeting or accept that it's a manager day and don't beat yourself up for shipping less.

---

## F. The Karpathy "obsessive single-problem focus" pattern

Karpathy's model (from [Lex Fridman #333](https://lexfridman.com/andrej-karpathy/) and [his fave-tweets](https://karpathy.ai/tweets.html)):
- Pick one problem.
- Saturate yourself in it (read, code, sleep on it).
- Ignore other inputs for the duration.

This is the high-end of deep work — not sustainable as a daily mode for someone with multiple jobs, but worth deploying for **1-2 weeks per quarter** on a milestone (e.g., a Solana milestone deliverable, or final interview prep). Block calendar, warn collaborators, ship.

---

## G. What we don't endorse

- **Pomodoro (25/5)** as a default. Useful for restarting after a slump, but 25 min is too short for genuinely hard problems. Use 90/15 instead.
- **"Always be in flow"** rhetoric. Flow is rare and not a daily target. Steady deep work is.
- **Productivity apps with social features** (timers that publish your sessions). Engineering attention away from the work itself.

---

Read next: [`04-failure-recovery.md`](./04-failure-recovery.md)
