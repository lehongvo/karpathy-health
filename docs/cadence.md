# Cadence — Daily / Weekly / Monthly / Quarterly

The system runs on four nested loops. Each loop catches what the inner loop missed.

---

## Daily loop (~10 min total)

**Morning (2 min, before email)**
- Open `/` (Daily Dashboard).
- Confirm today's MIT (set last night).
- Check energy slider 1-5.
- If energy ≤2 → de-scope the day. One deep work block, no extras.

**During the day**
- ≥1 deep work block (`/attention` → DeepWorkTimer).
- Slack/email batched 2× (e.g., 11:30 and 16:30).
- Log exercise if done (`/energy`).

**Evening (5 min)**
- Open `/review/daily`.
- 3 wins, 1 lesson, energy retro 1-5.
- Set tomorrow's MIT.
- Log sleep before midnight if you remember; else log it tomorrow morning.

---

## Weekly loop (~30 min, Sunday 17:00)

**Open `/review/weekly`.**

1. **Stats review** (auto-pulled):
   - Sleep avg, sleep consistency, nights &lt;6h
   - Deep work hours total + per project
   - Exercise sessions: count vs target
   - MIT hit rate
   - Distraction count trend
2. **Project review**:
   - Open `/tasks`, look at the board.
   - Did Active projects move? If a project hasn't moved in 2 weeks, ask why.
   - Anything need to move to Maintenance / Paused?
3. **Next week**:
   - Top 3 outcomes (not 10).
   - Block deep work hours on the calendar.
   - Block 3 exercise sessions on the calendar.
4. **Insights check** (`/insights`):
   - Read the auto-generated correlations.
   - If sleep ↔ deep work correlation is strong → that's your highest-leverage habit this week.

---

## Monthly loop (~1 hour, last Sunday of the month)

This isn't a separate page — it's an extended weekly review.

1. **Stats trend** (last 30 days vs prior 30):
   - Sleep avg trending up or down?
   - Deep work hours trending up or down?
   - Exercise consistency trending up or down?
2. **Habit audit** — from `06-tldr.md`:
   - Which of the 5 core habits is most fragile this month?
   - Why? (Travel? Job stress? Health?)
3. **Anti-pattern check** — from `05-anti-patterns.md`:
   - Did you slip into any anti-pattern? (Reading too much productivity content? Buying gear instead of building habits?)
4. **One adjustment** to the system. Just one. Don't over-tune.

---

## Quarterly loop (~3 hours, end of quarter)

**Open `/review/quarterly`.**

This is the **decision gate**. It maps to Section 8.5 of the karpathy-rust strategic plan: the quarterly checkpoint to decide pivot or persist.

1. **Stats over the quarter**:
   - Total deep work hours.
   - Sleep consistency.
   - Exercise consistency.
   - Burnout incidents (`BurnoutAlert` fires per quarter).
   - Projects shipped vs paused vs failed.
2. **Energy audit**:
   - Last quarter, what activities **drained** you most? List 3.
   - What activities **energized** you? List 3.
   - Move toward the energizers, away from the drainers. Concrete actions: cancel a recurring meeting? Drop a side project? Change one weekly habit?
3. **Goal check** (per memory: remote Solana/Rust job by 2027):
   - On track? Off track? Why?
   - What's the bottleneck — skill, applications, network, sleep, family load?
4. **System adjustment**:
   - Add ≤1 habit, drop ≤1 habit.
   - Update `decision-log.md` with the rationale.
5. **Read the dossier**:
   - Re-read [`00-philosophy.md`](./00-philosophy.md) and [`06-tldr.md`](./06-tldr.md). Are you still aligned?

---

## Cadence rules

1. **Don't skip Sunday review.** It's the pressure-relief valve. Without it, slips compound silently.
2. **Don't add a 5th loop.** Quarterly is as long as the planning horizon should be. Beyond that, life surprises you.
3. **Pre-schedule everything**: the Sunday review goes on the calendar this week, recurring forever. Not "I'll do it when I have time." You won't.
4. **The loops protect each other**: daily catches today's slip; weekly catches this week's; monthly catches drift; quarterly catches strategy mismatch. Skip one and the next has to do double duty.

---

Read next: [`decision-log.md`](./decision-log.md)
