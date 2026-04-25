"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/chrome/Container";
import { Button } from "@/components/primitives/Button";
import { TextInput, FieldLabel } from "@/components/primitives/Field";
import { useApp } from "@/lib/store";
import { projectRepo, taskRepo } from "@/lib/db/repos";
import { todayISO } from "@/lib/utils";

export default function SetupPage() {
  const router = useRouter();
  const { settings, setSettings } = useApp();
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [bedtime, setBedtime] = useState(String(settings.bedtimeHour));
  const [projectName, setProjectName] = useState("Rust / Solana");
  const [mit, setMit] = useState("");

  const finish = async () => {
    const bh = Math.max(0, Math.min(23, Number(bedtime)));
    setSettings({ bedtimeHour: bh, caffeineCutoffHour: bh - 8 });
    if (projectName.trim()) {
      const id = projectName.trim().toLowerCase().replace(/\s+/g, "-");
      await projectRepo.put({
        id,
        name: projectName.trim(),
        status: "active",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }
    if (mit.trim()) {
      await taskRepo.put({
        date: todayISO(),
        text: mit.trim(),
        priority: "mit",
        done: false,
        createdAt: Date.now(),
      });
    }
    router.push("/");
  };

  return (
    <Container size="sm" className="py-12 md:py-20 space-y-10">
      <div>
        <div className="text-[10px] uppercase tracking-widest text-muted">Setup · step {step + 1} of 3</div>
        <h1 className="font-serif text-3xl mt-2">Three settings, then we begin.</h1>
      </div>

      {step === 0 && (
        <section className="space-y-3">
          <FieldLabel>Typical bedtime hour (0–23)</FieldLabel>
          <TextInput type="number" min={0} max={23} value={bedtime} onChange={(e) => setBedtime(e.target.value)} />
          <p className="text-xs text-muted">
            Used to compute your caffeine cutoff (8h before bed, per Drake 2013).
          </p>
        </section>
      )}

      {step === 1 && (
        <section className="space-y-3">
          <FieldLabel>Your one active project right now</FieldLabel>
          <TextInput value={projectName} onChange={(e) => setProjectName(e.target.value)} />
          <p className="text-xs text-muted">
            More can be added later. Max 2 active at any time — see <code>docs/03-attention-protocol</code>.
          </p>
        </section>
      )}

      {step === 2 && (
        <section className="space-y-3">
          <FieldLabel>First MIT for today</FieldLabel>
          <TextInput value={mit} onChange={(e) => setMit(e.target.value)} placeholder="One sentence." className="text-lg" />
          <p className="text-xs text-muted">Optional. You can set it tomorrow morning instead.</p>
        </section>
      )}

      <div className="flex justify-between pt-4 border-t border-border">
        <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1) as 0 | 1 | 2)} disabled={step === 0}>
          Back
        </Button>
        {step < 2 ? (
          <Button onClick={() => setStep((s) => Math.min(2, s + 1) as 0 | 1 | 2)}>Next</Button>
        ) : (
          <Button onClick={finish}>Begin →</Button>
        )}
      </div>
    </Container>
  );
}
