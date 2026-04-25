"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

export const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn("relative flex w-full touch-none select-none items-center py-3", className)}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-px w-full grow bg-border">
      <SliderPrimitive.Range className="absolute h-px bg-text" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      data-slot="slider-thumb"
      className="block h-4 w-4 rounded-full border border-text bg-bg shadow transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:pointer-events-none"
    />
  </SliderPrimitive.Root>
));
Slider.displayName = "Slider";
