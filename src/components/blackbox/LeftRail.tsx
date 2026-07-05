import { motion } from "framer-motion";
import { Play, Stethoscope, Wrench, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { softSpring } from "@/lib/motion";
import type { NavKey } from "@/lib/blackbox";

const ITEMS: { key: NavKey; label: string; icon: LucideIcon }[] = [
  { key: "replay", label: "Replay", icon: Play },
  { key: "diagnosis", label: "Diagnosis", icon: Stethoscope },
  { key: "fix", label: "Fix", icon: Wrench },
  { key: "validation", label: "Validation", icon: ShieldCheck },
];

export function LeftRail({ active, onSelect }: { active: NavKey; onSelect: (k: NavKey) => void }) {
  return (
    <nav className="flex w-[76px] shrink-0 flex-col items-center gap-1 py-4">
      {ITEMS.map((item) => {
        const selected = active === item.key;
        return (
          <button
            key={item.key}
            onClick={() => onSelect(item.key)}
            className={cn(
              "relative flex w-16 flex-col items-center gap-1 rounded-xl py-2.5 text-[11px] font-medium tracking-[0.02em] transition-colors",
              selected ? "text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {selected && (
              <motion.span
                layoutId="rail-active"
                className="absolute inset-0 rounded-xl bg-card shadow-hairline"
                transition={softSpring}
              />
            )}
            <item.icon className="relative h-[18px] w-[18px]" strokeWidth={1.75} />
            <span className="relative">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
