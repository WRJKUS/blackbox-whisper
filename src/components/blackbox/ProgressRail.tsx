import { motion } from "framer-motion";
import { Check } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PROGRESS_STEPS, type ProgressKey } from "@/lib/blackbox";
import { cn } from "@/lib/utils";

export function ProgressRail({ done }: { done: ProgressKey[] }) {
  return (
    <TooltipProvider delayDuration={120}>
      <div className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2.5">
        {PROGRESS_STEPS.map((step, i) => {
          const complete = done.includes(step.key);
          return (
            <div key={step.key} className="flex items-center gap-1.5">
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button
                    whileHover={{ y: -1 }}
                    className={cn(
                      "flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[12px] font-medium transition-colors",
                      complete
                        ? "border-success/30 bg-success-soft text-success"
                        : "border-border bg-surface-muted text-muted-foreground",
                    )}
                  >
                    {complete ? (
                      <Check className="h-3 w-3" strokeWidth={3} />
                    ) : (
                      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
                    )}
                    {step.label}
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent side="bottom">{step.tooltip}</TooltipContent>
              </Tooltip>
              {i < PROGRESS_STEPS.length - 1 && (
                <span
                  className={cn(
                    "h-px w-4",
                    complete ? "bg-success/40" : "bg-border",
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
