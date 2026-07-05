import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { TopBar } from "@/components/blackbox/TopBar";
import { LeftRail } from "@/components/blackbox/LeftRail";
import { PromptBar } from "@/components/blackbox/PromptBar";
import { ReplayCanvas } from "@/components/blackbox/ReplayCanvas";
import { ProgressRail } from "@/components/blackbox/ProgressRail";
import { ValidationStrip } from "@/components/blackbox/ValidationStrip";
import { AgentPanel } from "@/components/blackbox/AgentPanel";
import { TechnicalDrawer } from "@/components/blackbox/TechnicalDrawer";
import { PlmView } from "@/components/blackbox/PlmView";
import { AGENT_STEPS, type NavKey, type ProgressKey } from "@/lib/blackbox";
import { FILED_ISSUE, type PlmIssue } from "@/lib/plm";
import { appleEase } from "@/lib/motion";

export const Route = createFileRoute("/")({
  component: Index,
});

type RegState = "pending" | "running" | "passed";

function Index() {
  const [nav, setNav] = useState<NavKey>("plm");
  const [prompt, setPrompt] = useState("Car steers too little during left turns.");
  const [diagnosing, setDiagnosing] = useState(false);
  const [visibleSteps, setVisibleSteps] = useState(0);
  const [replayKey, setReplayKey] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState("Trace");
  const [previewed, setPreviewed] = useState(false);
  const [regression, setRegression] = useState<RegState>("pending");
  const [fixSynced, setFixSynced] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const revealSteps = () => {
    clearTimers();
    setVisibleSteps(0);
    AGENT_STEPS.forEach((_, i) => {
      timers.current.push(setTimeout(() => setVisibleSteps(i + 1), 260 * (i + 1)));
    });
  };

  // Initial page-load reveal
  useEffect(() => {
    revealSteps();
    return clearTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDiagnose = () => {
    setDiagnosing(true);
    setReplayKey((k) => k + 1);
    revealSteps();
    timers.current.push(
      setTimeout(
        () => {
          setDiagnosing(false);
          toast.success("Diagnosis complete", {
            description: "Understeer traced to control clamp ordering.",
          });
        },
        260 * AGENT_STEPS.length + 300,
      ),
    );
  };

  const handlePreview = () => {
    setPreviewed(true);
    setDrawerTab("Patch");
    setDrawerOpen(true);
  };

  const handleTechnical = () => {
    setDrawerOpen(true);
  };

  const handleApply = () => {
    toast.success("Cursor context copied", {
      description: "Patch, file map and regression test ready in Cursor.",
    });
  };

  const handleRunRegression = () => {
    setRegression("running");
    setNav("validation");
    timers.current.push(
      setTimeout(() => {
        setRegression("passed");
        toast.success("Regression passed", {
          description: "Path error 1.4m → 0.12m · steering within tolerance.",
        });
      }, 1900),
    );
  };

  const handleOpenIssue = (issue: PlmIssue) => {
    if (issue.id === FILED_ISSUE.id) {
      setNav("replay");
      toast.success("ROS bag attached", {
        description: "paris_urban_drive_seg07.bag · 4.2s",
      });
    } else {
      toast.info("No replay attached", {
        description: "Only issues filed from Blackbox include a drive replay.",
      });
    }
  };

  const handleSyncToPlm = () => {
    if (fixSynced) return;
    setFixSynced(true);
    toast.success("Fix synced to PLM", {
      description: "PLM-1047 · Steering Controller · marked Resolved",
    });
    setNav("plm");
  };

  const progressDone: ProgressKey[] =
    regression === "passed"
      ? ["replay", "diagnose", "trace", "fix", "validate"]
      : previewed
        ? ["replay", "diagnose", "trace", "fix"]
        : ["replay", "diagnose", "trace"];

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background text-foreground">
      <TopBar onTechnical={handleTechnical} />

      <div className="flex min-h-0 flex-1">
        <LeftRail active={nav} onSelect={setNav} />

        {/* Central workspace */}
        <motion.main
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: appleEase }}
          className="flex min-w-0 flex-1 flex-col gap-6 overflow-y-auto p-8"
        >
          {nav === "plm" ? (
            <PlmView fixSynced={fixSynced} onOpenIssue={handleOpenIssue} />
          ) : (
            <>
              <PromptBar
                value={prompt}
                onChange={setPrompt}
                onDiagnose={handleDiagnose}
                diagnosing={diagnosing}
              />

              <p className="px-0.5 text-[13px] leading-relaxed text-muted-foreground">
                Opened from PLM-1047. Blackbox replays the drive, traces the root cause, maps it to
                code, and prepares the Cursor fix.
              </p>

              <ReplayCanvas replayKey={replayKey} />

              <ProgressRail done={progressDone} />

              <ValidationStrip regression={regression} />
            </>
          )}
        </motion.main>

        <AgentPanel
          visibleSteps={visibleSteps}
          regression={regression}
          canRunRegression={previewed}
          fixSynced={fixSynced}
          onApply={handleApply}
          onPreview={handlePreview}
          onTechnical={handleTechnical}
          onRunRegression={handleRunRegression}
          onSyncToPlm={handleSyncToPlm}
        />
      </div>

      <TechnicalDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        tab={drawerTab}
        onTabChange={setDrawerTab}
      />
    </div>
  );
}
