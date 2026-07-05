import { useState } from "react";
import { motion } from "framer-motion";
import { Cpu, ChevronRight } from "lucide-react";
import { CarSchematic } from "@/components/blackbox/CarSchematic";
import { appleEase } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { FILED_ISSUE, PLM_ISSUES, SEVERITY_META, STATUS_META, type PlmIssue } from "@/lib/plm";

function IssueRow({
  issue,
  index,
  flashResolved,
  selected,
  onHover,
  onOpen,
}: {
  issue: PlmIssue;
  index: number;
  flashResolved: boolean;
  selected: boolean;
  onHover: (id: string | null) => void;
  onOpen: () => void;
}) {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 8 }}
      animate={
        flashResolved
          ? {
              opacity: 1,
              y: 0,
              backgroundColor: ["oklch(0.972 0.016 152)", "oklch(1 0 0 / 0)"],
            }
          : { opacity: 1, y: 0 }
      }
      transition={{
        duration: 0.4,
        ease: appleEase,
        delay: index * 0.05,
        ...(flashResolved && { backgroundColor: { duration: 2.4, ease: "easeOut", delay: 0.4 } }),
      }}
      onMouseEnter={() => onHover(issue.id)}
      onMouseLeave={() => onHover(null)}
      onClick={onOpen}
      className={cn(
        "group -mx-2 flex w-[calc(100%+16px)] cursor-pointer flex-col gap-1 rounded-xl px-2 py-3 text-left transition-colors hover:bg-secondary/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        selected && "bg-secondary/60",
      )}
    >
      <div className="flex items-center gap-2">
        <span className="font-mono text-xs text-muted-foreground">{issue.id}</span>
        <span
          className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${SEVERITY_META[issue.severity].badge}`}
        >
          {SEVERITY_META[issue.severity].label}
        </span>
        <span
          className={`ml-auto rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUS_META[issue.status].badge}`}
        >
          {STATUS_META[issue.status].label}
        </span>
        <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
      <p className="text-[13px] font-medium leading-snug text-foreground">{issue.title}</p>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
          {issue.component}
        </span>
        <span>Opened {issue.opened}</span>
        {issue.source === "blackbox" && (
          <span className="inline-flex items-center gap-1 rounded-full bg-replay-soft px-2 py-0.5 text-[11px] font-medium text-primary">
            <Cpu className="h-3 w-3" /> From Hardware Agent
          </span>
        )}
      </div>
      {issue.detail && (
        <p className="truncate font-mono text-[11px] text-muted-foreground">{issue.detail}</p>
      )}
    </motion.button>
  );
}

export function PlmView({
  fixSynced,
  onOpenIssue,
}: {
  fixSynced: boolean;
  onOpenIssue: (issue: PlmIssue) => void;
}) {
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const issues: PlmIssue[] = [
    fixSynced ? { ...FILED_ISSUE, status: "resolved" } : FILED_ISSUE,
    ...PLM_ISSUES,
  ];
  const hovered = issues.find((i) => i.id === (highlightedId ?? selectedId));

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: appleEase }}
      className="flex min-w-0 flex-col gap-6"
    >
      {/* Header */}
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
            Product lifecycle
          </p>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold tracking-[-0.01em] text-foreground">
              Vehicle issues
            </h2>
            <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
              {issues.length} tracked
            </span>
          </div>
        </div>
        <span className="text-xs text-muted-foreground">
          Paris Urban Drive fleet · synced 2 min ago
        </span>
      </div>

      <div className="grid grid-cols-[1.15fr_1fr] items-start gap-6">
        {/* Issues list */}
        <div className="rounded-2xl bg-card p-5 shadow-card">
          <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
            Issues
          </p>
          <div className="mt-2 flex flex-col divide-y divide-border">
            {issues.map((issue, i) => (
              <IssueRow
                key={issue.id}
                issue={issue}
                index={i}
                flashResolved={fixSynced && issue.id === FILED_ISSUE.id}
                selected={selectedId === issue.id}
                onHover={setHighlightedId}
                onOpen={() => {
                  setSelectedId(issue.id);
                  onOpenIssue(issue);
                }}
              />
            ))}
          </div>
        </div>

        {/* Vehicle map */}
        <div className="rounded-2xl bg-card p-5 shadow-card">
          <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
            Vehicle map
          </p>
          <CarSchematic
            issues={issues}
            highlightedId={highlightedId ?? selectedId}
            pulseId={fixSynced ? null : FILED_ISSUE.id}
          />
          <p className="h-4 text-center text-xs text-muted-foreground">
            {hovered ? `${hovered.component} · ${hovered.system}` : "Hover an issue to locate it"}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
