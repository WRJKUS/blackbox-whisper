import { motion } from "framer-motion";
import { ChevronDown, Box, ExternalLink, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TopBar({ onTechnical }: { onTechnical: () => void }) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b border-border bg-card/80 px-6 backdrop-blur-xl">
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <div className="flex h-7 w-7 items-center justify-center rounded-[9px] bg-foreground">
          <Box className="h-4 w-4 text-card" strokeWidth={2.25} />
        </div>
        <span className="text-sm font-semibold tracking-[-0.01em] text-foreground">
          Autonomy Blackbox
        </span>
      </div>

      <div className="h-5 w-px bg-border" />

      {/* Project selector */}
      <button className="group flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary">
        <span className="text-muted-foreground">Project</span>
        <span>Paris Urban Drive</span>
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:translate-y-0.5" />
      </button>

      {/* Status */}
      <div className="flex items-center gap-2 rounded-full bg-secondary/80 px-3 py-1">
        <span className="relative flex h-1.5 w-1.5">
          <motion.span
            className="absolute inline-flex h-full w-full rounded-full bg-success opacity-60"
            animate={{ scale: [1, 2.4, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
        </span>
        <span className="text-xs font-medium text-foreground">Live Replay Connected</span>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={onTechnical}>
          <FileText className="h-3.5 w-3.5" />
          Technical Details
        </Button>
        <Button size="sm" className="h-8 gap-1.5">
          Open in Cursor
          <ExternalLink className="h-3.5 w-3.5" />
        </Button>
      </div>
    </header>
  );
}
