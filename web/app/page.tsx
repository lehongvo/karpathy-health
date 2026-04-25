"use client";

import { Container } from "@/components/chrome/Container";
import { BurnoutNotice } from "@/components/journal/BurnoutNotice";
import { MorningRitual } from "@/components/journal/MorningRitual";
import { DayView } from "@/components/journal/DayView";
import { EveningRitual } from "@/components/journal/EveningRitual";
import { useApp, activeMode } from "@/lib/store";

export default function TodayPage() {
  const modeOverride = useApp((s) => s.modeOverride);
  const mode = activeMode(modeOverride);

  return (
    <>
      <BurnoutNotice />
      <Container className="py-8 md:py-12">
        {mode === "morning" ? <MorningRitual /> : null}
        {mode === "day" ? <DayView /> : null}
        {mode === "evening" ? <EveningRitual /> : null}
      </Container>
    </>
  );
}
