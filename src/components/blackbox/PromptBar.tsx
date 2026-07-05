import { motion } from "framer-motion";
import { Paperclip, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PromptBar({
  value,
  onChange,
  onDiagnose,
  diagnosing,
}: {
  value: string;
  onChange: (v: string) => void;
  onDiagnose: () => void;
  diagnosing: boolean;
}) {
  return (
    <div className="rounded-2xl bg-card p-3 shadow-card">
      <div className="flex items-center gap-2">
        <Sparkles className="ml-1.5 h-4 w-4 shrink-0 text-muted-foreground" />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onDiagnose()}
          placeholder="Describe a vehicle behavior issue…"
          className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
        <div className="flex shrink-0 items-center gap-2">
          <span className="hidden items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground sm:inline-flex">
            <Paperclip className="h-3.5 w-3.5" /> ROS bag attached
            <CheckCircle2 className="h-3.5 w-3.5 text-success" />
          </span>
          <Button size="sm" className="h-9 gap-1.5 px-5" onClick={onDiagnose} disabled={diagnosing}>
            {diagnosing ? (
              <motion.span
                className="h-3.5 w-3.5 rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
              />
            ) : (
              <Sparkles className="h-3.5 w-3.5" />
            )}
            Diagnose
          </Button>
        </div>
      </div>
    </div>
  );
}
