import { Container } from "@/components/chrome/Container";

export default function Loading() {
  return (
    <Container className="py-10">
      <div className="space-y-4 animate-pulse">
        <div className="h-7 w-1/3 bg-border rounded" />
        <div className="h-4 w-2/3 bg-border rounded" />
        <div className="h-32 bg-border rounded mt-8" />
      </div>
    </Container>
  );
}
