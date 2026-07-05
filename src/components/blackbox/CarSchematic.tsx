import { motion } from "framer-motion";
import { softSpring } from "@/lib/motion";
import { REGION_POINTS, SEVERITY_META, type PlmIssue } from "@/lib/plm";

export function CarSchematic({
  issues,
  highlightedId,
  newIssueId,
}: {
  issues: PlmIssue[];
  highlightedId: string | null;
  newIssueId: string | null;
}) {
  return (
    <svg
      viewBox="0 0 220 440"
      className="mx-auto h-[400px] w-auto text-muted-foreground/70"
      fill="none"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Wheels */}
      <rect
        x={18}
        y={88}
        width={22}
        height={48}
        rx={9}
        fill="var(--secondary)"
        stroke="currentColor"
      />
      <rect
        x={180}
        y={88}
        width={22}
        height={48}
        rx={9}
        fill="var(--secondary)"
        stroke="currentColor"
      />
      <rect
        x={18}
        y={304}
        width={22}
        height={48}
        rx={9}
        fill="var(--secondary)"
        stroke="currentColor"
      />
      <rect
        x={180}
        y={304}
        width={22}
        height={48}
        rx={9}
        fill="var(--secondary)"
        stroke="currentColor"
      />

      {/* Body outline */}
      <path
        d="M110 26 C64 26 42 62 38 112 L34 155 L34 345 C34 394 66 414 110 414 C154 414 186 394 186 345 L186 155 L182 112 C178 62 156 26 110 26 Z"
        fill="var(--card)"
        stroke="currentColor"
      />

      {/* Greenhouse */}
      <rect x={58} y={152} width={104} height={166} rx={30} stroke="currentColor" />

      {/* Windshield + rear window */}
      <path d="M62 188 Q110 172 158 188" stroke="currentColor" opacity={0.7} />
      <path d="M62 286 Q110 300 158 286" stroke="currentColor" opacity={0.7} />

      {/* Mirrors */}
      <path d="M58 160 L48 154" stroke="currentColor" />
      <path d="M162 160 L172 154" stroke="currentColor" />

      {/* Battery pack hint */}
      <rect
        x={78}
        y={212}
        width={64}
        height={104}
        rx={10}
        stroke="currentColor"
        strokeDasharray="3 4"
        opacity={0.45}
      />

      {/* Issue markers */}
      {issues.map((issue, i) => {
        const point = REGION_POINTS[issue.region];
        const meta = SEVERITY_META[issue.severity];
        const highlighted = highlightedId === issue.id;
        const dimmed = highlightedId !== null && !highlighted;
        return (
          <motion.g
            key={issue.id}
            style={{ transformBox: "fill-box", transformOrigin: "50% 50%" }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ ...softSpring, delay: 0.25 + i * 0.07 }}
          >
            {issue.id === newIssueId && (
              <motion.circle
                cx={point.cx}
                cy={point.cy}
                fill="none"
                stroke="var(--anomaly)"
                animate={{ r: [9, 18], opacity: [0.55, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
              />
            )}
            <motion.circle
              cx={point.cx}
              cy={point.cy}
              fill={meta.halo}
              stroke={meta.marker}
              strokeWidth={1}
              animate={{ r: highlighted ? 12 : 9, opacity: dimmed ? 0.35 : 1 }}
              transition={{ duration: 0.25 }}
            />
            <circle cx={point.cx} cy={point.cy} r={3.5} fill={meta.marker} stroke="none" />
          </motion.g>
        );
      })}
    </svg>
  );
}
