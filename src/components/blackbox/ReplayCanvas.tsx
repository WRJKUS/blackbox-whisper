import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import parisReplay from "@/assets/paris-replay.jpg";
import replayVideo from "@/assets/replay.mp4";
import { appleEase, easeOutQuart } from "@/lib/motion";

function OverlayLabel({
  className,
  tone = "neutral",
  children,
}: {
  className?: string;
  tone?: "neutral" | "replay" | "anomaly";
  children: React.ReactNode;
}) {
  const dot =
    tone === "replay" ? "bg-replay" : tone === "anomaly" ? "bg-anomaly" : "bg-muted-foreground";
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.1, duration: 0.5, ease: appleEase }}
      className={`absolute flex items-center gap-1.5 rounded-full bg-card/70 px-2.5 py-1 shadow-float backdrop-blur-md ${className ?? ""}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      <span className="text-[11px] font-medium leading-none text-foreground">{children}</span>
    </motion.div>
  );
}

export function ReplayCanvas({ replayKey }: { replayKey: number }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-card shadow-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
        <h2 className="text-sm font-semibold tracking-[-0.01em] text-foreground">
          Left turn understeer at Paris intersection
        </h2>
        <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
          Segment 07 · 4.2s
        </span>
      </div>

      <div className="relative aspect-[16/9] w-full bg-surface-muted">
        <video
          key={replayKey}
          src={replayVideo}
          poster={parisReplay}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

        {/* Path overlay */}
        <svg
          key={replayKey}
          viewBox="0 0 1280 720"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
        >
          {/* Planned path - accent blue smooth */}
          <motion.path
            d="M 660 700 C 640 520, 560 430, 300 400"
            fill="none"
            stroke="var(--replay)"
            strokeWidth={2.5}
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.1, ease: easeOutQuart }}
          />
          {/* Actual path - red dashed (understeer, drifts wide) */}
          <motion.path
            d="M 660 700 C 660 540, 640 470, 470 430"
            fill="none"
            stroke="var(--anomaly)"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeDasharray="9 8"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.1, ease: easeOutQuart, delay: 0.25 }}
          />
        </svg>

        {/* Labels */}
        <OverlayLabel tone="replay" className="left-[20%] top-[42%]">
          expected turn
        </OverlayLabel>
        <OverlayLabel tone="anomaly" className="left-[40%] top-[62%]">
          understeer
        </OverlayLabel>
        <OverlayLabel tone="anomaly" className="left-[52%] top-[50%]">
          1.4m drift
        </OverlayLabel>

        {/* Timestamp chip */}
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5, ease: appleEase }}
          className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-card/70 px-3 py-1.5 shadow-float backdrop-blur-md"
        >
          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-[11px] font-medium text-foreground">
            Replay 12:04:18 · left turn segment
          </span>
        </motion.div>

        {/* Legend */}
        <div className="absolute bottom-3 left-3 flex flex-col gap-1.5 rounded-xl bg-card/70 px-3 py-2 shadow-float backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="h-0.5 w-5 rounded-full bg-replay" />
            <span className="text-xs text-muted-foreground">Planned path</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="h-0.5 w-5 rounded-full"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(to right, var(--anomaly) 0 4px, transparent 4px 7px)",
              }}
            />
            <span className="text-xs text-muted-foreground">Actual path</span>
          </div>
        </div>
      </div>
    </div>
  );
}
