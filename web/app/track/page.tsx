"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Container } from "@/components/chrome/Container";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/primitives/Tabs";
import { EnergyTab } from "@/components/track/EnergyTab";
import { AttentionTab } from "@/components/track/AttentionTab";
import { ProjectsTab } from "@/components/track/ProjectsTab";

export default function TrackPage() {
  const params = useSearchParams();
  const initialTab = params.get("tab") ?? "energy";
  const [tab, setTab] = useState(initialTab);

  useEffect(() => {
    const next = params.get("tab");
    if (next) setTab(next);
  }, [params]);

  return (
    <Container className="py-8 md:py-12">
      <h1 className="font-serif text-3xl mb-1">Track</h1>
      <p className="text-sm text-muted mb-8">
        The four levers: energy, attention, projects. Each on its own tab so daily logging is one minute.
      </p>
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="energy">Energy</TabsTrigger>
          <TabsTrigger value="attention">Attention</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
        </TabsList>
        <TabsContent value="energy">
          <EnergyTab />
        </TabsContent>
        <TabsContent value="attention">
          <AttentionTab />
        </TabsContent>
        <TabsContent value="projects">
          <ProjectsTab />
        </TabsContent>
      </Tabs>
    </Container>
  );
}
