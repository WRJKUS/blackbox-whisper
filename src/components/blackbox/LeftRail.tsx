import { motion } from "framer-motion";
import { Play, Stethoscope, Wrench, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NavKey } from "@/lib/blackbox";

const ITEMS: { key: NavKey; label: string; icon: LucideIcon }[] = [
  { key: "replay", label: "Replay", icon: Play },
  { key: "diagnosis", label: "Diagnosis", icon: Stethoscope },
  { key: "fix", label: "Fix", icon: Wrench },
  { key: "validation", label: "Validation", icon: ShieldCheck },
];

export function LeftRail({
  active,
  onSelect,
}: {
  active: NavKey;
  onSelect: (k: NavKey) => void;
}) {
  return (
    <nav className="flex w-[68px] shrink-0 flex-col items-center gap-1 border-r border-border bg-card py-4">
      {ITEMS.map((item) => {
        const selected = active === item.key;
        return (
          <button
            key={item.key}
            onClick={() => onSelect(item.key)}
            className={cn(
              "relative flex w-14 flex-col items-center gap-1 rounded-lg py-2.5 text-[11px] font-medium transition-colors",
              selected
                ? "text-foreground"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground",
            )}
          >
            {selected && (
              <motion.span
                layoutId="rail-active"
                className="absolute inset-0 rounded-lg bg-secondary"
                transition={{ type: "spring", stiffness: 500, damping: 40 }}
              />
            )}
            <item.icon className="relative h-[18px] w-[18px]" strokeWidth={2} />
            <span className="relative">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
