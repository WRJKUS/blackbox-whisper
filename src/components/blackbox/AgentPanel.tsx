import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Circle,
  Cpu,
  FileCode2,
  Eye,
  FileText,
  FlaskConical,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { easeOutQuart, appleEase } from "@/lib/motion";
import { AGENT_STEPS, METRICS, ROOT_FILE, ROOT_FN } from "@/lib/blackbox";

type RegState = "pending" | "running" | "passed";

export function AgentPanel({
  visibleSteps,
  regression,
  canRunRegression,
  onApply,
  onPreview,
  onTechnical,
  onRunRegression,
}: {
  visibleSteps: number;
  regression: RegState;
  canRunRegression: boolean;
  onApply: () => void;
  onPreview: () => void;
  onTechnical: () => void;
  onRunRegression: () => void;
}) {
  const allDone = visibleSteps >= AGENT_STEPS.length;

  return (
    <aside className="flex w-[380px] shrink-0 flex-col overflow-y-auto border-l border-border bg-card">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card/85 px-5 py-3.5 backdrop-blur-xl">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-foreground">
            <Cpu className="h-4 w-4 text-card" strokeWidth={2} />
          </div>
          <div className="leading-tight">
            <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-foreground">
              Blackbox Agent
            </p>
            <p className="text-xs text-muted-foreground">Diagnosis ready</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-success-soft px-2.5 py-0.5 text-[11px] font-medium text-success">
          <span className="h-1.5 w-1.5 rounded-full bg-success" /> ready
        </span>
      </div>

      <div className="flex flex-col gap-5 p-5">
        {/* Diagnosis */}
        <section className="flex flex-col gap-1.5">
          <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
            Diagnosis
          </p>
          <p className="text-sm font-semibold leading-snug tracking-[-0.01em] text-foreground">
            Steering command was too low.
          </p>
          <p className="text-[13px] leading-relaxed text-muted-foreground">
            The planner requested{" "}
            <span className="font-medium text-foreground">18.4° steering</span>, but the control
            module output only <span className="font-medium text-anomaly">9.7°</span> because
            steering was clamped before curvature compensation.
          </p>
        </section>

        {/* Fix */}
        <section className="rounded-xl bg-replay-soft p-3.5">
          <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-primary">Fix</p>
          <p className="mt-1 text-[13px] font-medium leading-snug text-foreground">
            Move the steering clamp after curvature compensation.
          </p>
        </section>

        {/* Root cause card */}
        <section className="rounded-xl bg-surface-muted p-3.5 shadow-hairline">
          <div className="flex items-center gap-1.5">
            <FileCode2 className="h-3.5 w-3.5 text-foreground" />
            <p className="text-[13px] font-semibold text-foreground">Root cause isolated</p>
          </div>
          <div className="mt-2 rounded-lg bg-card px-2.5 py-2 font-mono text-xs leading-relaxed shadow-hairline">
            <p className="text-foreground">{ROOT_FILE}</p>
            <p className="text-muted-foreground">{ROOT_FN}</p>
          </div>
          <div className="mt-2.5 flex items-center gap-1.5">
            <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
              Control
            </span>
            <span className="rounded-full bg-success-soft px-2 py-0.5 text-[11px] font-medium text-success">
              Patch ready
            </span>
          </div>
          <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground">
            Clamp is applied before curvature compensation.
          </p>
        </section>

        {/* Metric grid */}
        <section className="grid grid-cols-2 gap-2">
          {METRICS.map((m) => (
            <div key={m.label} className="rounded-xl bg-surface-muted px-4 py-3">
              <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
                {m.label}
              </p>
              <p className="mt-1 text-2xl font-light tabular-nums tracking-[-0.02em] text-foreground">
                {m.value}
              </p>
            </div>
          ))}
        </section>

        {/* Agent steps checklist */}
        <section className="flex flex-col gap-1">
          <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
            Agent steps
          </p>
          {AGENT_STEPS.map((step, i) => {
            const done = i < visibleSteps;
            return (
              <AnimatePresence key={step}>
                {done && (
                  <motion.div
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, ease: easeOutQuart }}
                    className="flex items-center gap-2 py-1"
                  >
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-success-soft">
                      <Check className="h-2.5 w-2.5 text-success" strokeWidth={3.5} />
                    </span>
                    <span className="text-[13px] text-foreground">{step}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            );
          })}
          {!allDone &&
            AGENT_STEPS.slice(visibleSteps, visibleSteps + 1).map((step) => (
              <div key={step} className="flex items-center gap-2 py-1">
                <Circle className="h-4 w-4 animate-pulse text-muted-foreground/40" />
                <span className="text-[13px] text-muted-foreground">{step}</span>
              </div>
            ))}
        </section>

        <AnimatePresence>
          {allDone && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: appleEase }}
              className={cn(
                "rounded-xl px-3.5 py-2.5 text-[13px] font-medium",
                regression === "passed"
                  ? "bg-success-soft text-success"
                  : "bg-surface-muted text-foreground shadow-hairline",
              )}
            >
              {regression === "passed"
                ? "Regression passed. Fix validated."
                : "Ready to apply patch in Cursor."}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Buttons */}
        <div className="flex flex-col gap-2.5 pt-1">
          <Button className="h-11 w-full gap-1.5" onClick={onApply}>
            Apply in Cursor
            <ArrowRight className="h-4 w-4" />
          </Button>
          <div className="flex gap-2.5">
            <Button variant="outline" className="h-10 flex-1 gap-1.5" onClick={onPreview}>
              <Eye className="h-4 w-4" /> Preview Fix
            </Button>
            <Button variant="outline" className="h-10 flex-1 gap-1.5" onClick={onTechnical}>
              <FileText className="h-4 w-4" /> Technical
            </Button>
          </div>
          <Button
            variant="secondary"
            className="h-10 w-full gap-1.5"
            disabled={!canRunRegression || regression === "running" || regression === "passed"}
            onClick={onRunRegression}
          >
            <FlaskConical className="h-4 w-4" />
            {regression === "running"
              ? "Running regression…"
              : regression === "passed"
                ? "Regression passed"
                : "Run Regression Test"}
          </Button>
        </div>
      </div>
    </aside>
  );
}
