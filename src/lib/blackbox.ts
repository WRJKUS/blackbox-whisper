export type NavKey = "replay" | "diagnosis" | "fix" | "validation";

export const AGENT_STEPS = [
  "Replay loaded",
  "ROS topics traced",
  "Behavior mismatch found",
  "Root cause isolated",
  "Code mapping generated",
  "Cursor context prepared",
  "Regression test generated",
] as const;

export type ProgressKey = "replay" | "diagnose" | "trace" | "fix" | "validate";

export const PROGRESS_STEPS: {
  key: ProgressKey;
  label: string;
  tooltip: string;
}[] = [
  { key: "replay", label: "Replay", tooltip: "Drive segment reconstructed" },
  { key: "diagnose", label: "Diagnose", tooltip: "Understeer detected" },
  { key: "trace", label: "Trace", tooltip: "Control module isolated" },
  { key: "fix", label: "Fix", tooltip: "Cursor patch prepared" },
  { key: "validate", label: "Validate", tooltip: "Regression pending" },
];

export const METRICS = [
  { label: "Confidence", value: "91%" },
  { label: "Path error", value: "1.4m" },
  { label: "Expected", value: "18.4°" },
  { label: "Actual", value: "9.7°" },
];

export const ROOT_FILE = "src/control/steering_controller.cpp";
export const ROOT_FN = "calculateSteeringAngle(curvature, speed)";
