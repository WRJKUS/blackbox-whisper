import { motion, AnimatePresence } from "framer-motion";
import { XCircle, CheckCircle2, Clock, Loader2 } from "lucide-react";
import { appleEase } from "@/lib/motion";

type RegState = "pending" | "running" | "passed";

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col gap-2 rounded-2xl bg-card p-5 shadow-card">
      <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
        {title}
      </span>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-lg font-light tabular-nums tracking-[-0.01em] text-foreground">
        {value}
      </span>
    </div>
  );
}

export function ValidationStrip({ regression }: { regression: RegState }) {
  return (
    <div className="flex gap-3">
      <Card title="Before">
        <Row label="Path error" value="1.4m" />
        <Row label="Steering deviation" value="-8.7°" />
        <div className="mt-0.5 inline-flex w-fit items-center gap-1 rounded-full bg-anomaly-soft px-2 py-0.5 text-[11px] font-medium text-anomaly">
          <XCircle className="h-3 w-3" /> Failed
        </div>
      </Card>

      <Card title="After">
        <AnimatePresence mode="wait">
          {regression === "passed" ? (
            <motion.div
              key="after-pass"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: appleEase }}
              className="flex flex-col gap-2"
            >
              <Row label="Path error" value="0.12m" />
              <Row label="Steering deviation" value="-0.6°" />
              <div className="mt-0.5 inline-flex w-fit items-center gap-1 rounded-full bg-success-soft px-2 py-0.5 text-[11px] font-medium text-success">
                <CheckCircle2 className="h-3 w-3" /> Passed
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="after-wait"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-1"
            >
              <span className="text-[13px] font-medium text-foreground">
                Waiting for regression
              </span>
              <span className="text-xs text-muted-foreground">Run test after patch preview</span>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      <Card title="Regression">
        <div className="flex flex-1 items-center">
          {regression === "passed" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: appleEase }}
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-success"
            >
              <CheckCircle2 className="h-4 w-4" /> Regression passed
            </motion.div>
          ) : regression === "running" ? (
            <div className="inline-flex items-center gap-1.5 text-[13px] font-medium text-foreground">
              <Loader2 className="h-4 w-4 animate-spin text-primary" /> Running…
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground">
              <Clock className="h-4 w-4" /> Regression pending
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
