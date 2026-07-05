import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileCode2, Folder, ChevronRight } from "lucide-react";
import { ROOT_FILE, ROOT_FN } from "@/lib/blackbox";

const FILE_TREE = [
  { name: "src", type: "folder", depth: 0 },
  { name: "control", type: "folder", depth: 1 },
  { name: "steering_controller.cpp", type: "file", depth: 2, active: true },
  { name: "trajectory_planner.cpp", type: "file", depth: 2 },
  { name: "perception", type: "folder", depth: 1 },
  { name: "tests", type: "folder", depth: 0 },
  { name: "left_turn_regression.cpp", type: "file", depth: 1 },
];

function Line({ children, tone }: { children: React.ReactNode; tone?: "muted" | "add" | "del" }) {
  const c =
    tone === "add"
      ? "text-success"
      : tone === "del"
        ? "text-anomaly"
        : tone === "muted"
          ? "text-muted-foreground"
          : "text-foreground";
  return <div className={`font-mono text-xs leading-relaxed ${c}`}>{children}</div>;
}

export function TechnicalDrawer({
  open,
  onOpenChange,
  tab,
  onTabChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  tab: string;
  onTabChange: (v: string) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-[560px]">
        <SheetHeader className="border-b border-border px-5 py-4">
          <SheetTitle className="text-sm font-semibold tracking-[-0.01em]">
            Technical Details
          </SheetTitle>
          <p className="text-xs text-muted-foreground">Left turn understeer · Control module</p>
        </SheetHeader>

        <Tabs value={tab} onValueChange={onTabChange} className="flex min-h-0 flex-1 flex-col">
          <TabsList className="mx-5 mt-4 grid h-9 w-auto grid-cols-5 rounded-full p-1">
            {["Trace", "Code", "Logs", "Patch", "Test"].map((t) => (
              <TabsTrigger key={t} value={t} className="rounded-full text-xs">
                {t}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
            <TabsContent value="Trace" className="mt-0 space-y-2">
              <div className="rounded-xl bg-surface-muted p-3.5 shadow-hairline">
                <Line>
                  Planner requested <span className="font-semibold">18.4°</span>
                </Line>
                <Line>
                  Control output <span className="font-semibold text-anomaly">9.7°</span>
                </Line>
                <Line>
                  Vehicle drifted <span className="font-semibold">1.4m</span>
                </Line>
                <Line tone="muted">Root module: Control</Line>
              </div>
            </TabsContent>

            <TabsContent value="Code" className="mt-0">
              <CursorPreview />
            </TabsContent>

            <TabsContent value="Logs" className="mt-0">
              <div className="rounded-xl bg-surface-muted p-3.5 shadow-hairline">
                <Line tone="muted">[12:04:18.201] /planning/steering_cmd → 18.4°</Line>
                <Line tone="muted">[12:04:18.244] /control/clamp applied max 9.7°</Line>
                <Line tone="del">[12:04:18.259] WARN curvature comp skipped (post-clamp)</Line>
                <Line tone="muted">[12:04:18.312] /vehicle/pose lateral_error 1.40m</Line>
              </div>
            </TabsContent>

            <TabsContent value="Patch" className="mt-0 space-y-3">
              <div className="rounded-xl bg-anomaly-soft p-3.5">
                <p className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.08em] text-anomaly">
                  Before
                </p>
                <Line>angle → clamp → compensation</Line>
              </div>
              <div className="rounded-xl bg-success-soft p-3.5">
                <p className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.08em] text-success">
                  After
                </p>
                <Line>angle → compensation → clamp</Line>
              </div>
              <div className="rounded-xl bg-card p-3.5 shadow-hairline">
                <Line tone="del">- angle = clamp(angle);</Line>
                <Line tone="del">- angle = compensate(angle, curvature);</Line>
                <Line tone="add">+ angle = compensate(angle, curvature);</Line>
                <Line tone="add">+ angle = clamp(angle);</Line>
              </div>
            </TabsContent>

            <TabsContent value="Test" className="mt-0">
              <div className="rounded-xl bg-surface-muted p-3.5 shadow-hairline">
                <Line>LeftTurnSteeringRegression</Line>
                <Line tone="muted">Expected: 18.4° ± 0.8°</Line>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}

function CursorPreview() {
  return (
    <div className="overflow-hidden rounded-xl shadow-hairline">
      <div className="grid grid-cols-[150px_1fr]">
        {/* File tree */}
        <div className="border-r border-border bg-surface-muted py-2">
          {FILE_TREE.map((f, i) => (
            <div
              key={i}
              className={`flex items-center gap-1 px-2 py-1 text-xs ${
                f.active ? "bg-replay-soft font-medium text-foreground" : "text-muted-foreground"
              }`}
              style={{ paddingLeft: 8 + f.depth * 10 }}
            >
              {f.type === "folder" ? (
                <>
                  <ChevronRight className="h-3 w-3 shrink-0" />
                  <Folder className="h-3 w-3 shrink-0" />
                </>
              ) : (
                <FileCode2 className="h-3 w-3 shrink-0" />
              )}
              <span className="truncate">{f.name}</span>
            </div>
          ))}
        </div>

        {/* Code */}
        <div className="bg-card">
          <div className="flex items-center gap-1.5 border-b border-border px-3 py-1.5 text-xs text-muted-foreground">
            <FileCode2 className="h-3 w-3" /> {ROOT_FILE}
          </div>
          <div className="px-3 py-2 font-mono text-xs leading-relaxed">
            <Line tone="muted">// {ROOT_FN}</Line>
            <div className="rounded bg-replay-soft px-1">
              <Line>double calculateSteeringAngle(</Line>
              <Line>&nbsp;&nbsp;double curvature, double speed) {"{"}</Line>
            </div>
            <Line>&nbsp;&nbsp;double angle = planner_cmd;</Line>
            <Line tone="add">+ angle = compensate(angle, curvature);</Line>
            <Line>&nbsp;&nbsp;angle = clamp(angle, kMax);</Line>
            <Line>&nbsp;&nbsp;return angle;</Line>
            <Line>{"}"}</Line>
          </div>
          <div className="border-t border-border bg-surface-muted px-3 py-2">
            <p className="text-xs leading-relaxed text-muted-foreground">
              <span className="font-medium text-foreground">Patch explanation:</span> curvature
              compensation now runs before the clamp, restoring the requested 18.4° turn.
            </p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              <span className="font-medium text-foreground">Regression:</span>{" "}
              <span className="font-mono">LeftTurnSteeringRegression</span> — expect 18.4° ± 0.8°.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
