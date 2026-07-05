export type PlmSeverity = "high" | "medium" | "low";
export type PlmStatus = "open" | "in-review" | "resolved";

export type CarRegion =
  | "steering"
  | "front-camera"
  | "front-left-brake"
  | "battery"
  | "driver-door"
  | "hvac";

export type PlmIssue = {
  id: string;
  title: string;
  system: string;
  component: string;
  severity: PlmSeverity;
  status: PlmStatus;
  opened: string;
  region: CarRegion;
  source: "manual" | "blackbox";
  detail?: string;
};

export const PLM_ISSUES: PlmIssue[] = [
  {
    id: "PLM-1044",
    title: "HVAC compressor whine above 90 km/h",
    system: "Cabin",
    component: "HVAC Unit",
    severity: "low",
    status: "open",
    opened: "Jun 26",
    region: "hvac",
    source: "manual",
  },
  {
    id: "PLM-1041",
    title: "Brake actuation latency exceeds 180 ms budget",
    system: "Braking",
    component: "Front Brake Actuator",
    severity: "medium",
    status: "open",
    opened: "Jun 19",
    region: "front-left-brake",
    source: "manual",
  },
  {
    id: "PLM-1038",
    title: "Phantom braking triggered by overpass shadows",
    system: "Perception",
    component: "Front Camera",
    severity: "high",
    status: "in-review",
    opened: "Jun 12",
    region: "front-camera",
    source: "manual",
  },
  {
    id: "PLM-1033",
    title: "Door handle fails to present below −15 °C",
    system: "Body",
    component: "Driver Door Handle",
    severity: "low",
    status: "resolved",
    opened: "Jun 3",
    region: "driver-door",
    source: "manual",
  },
  {
    id: "PLM-1027",
    title: "Battery pack thermal derate in stop-and-go traffic",
    system: "Powertrain",
    component: "HV Battery Pack",
    severity: "medium",
    status: "in-review",
    opened: "May 30",
    region: "battery",
    source: "manual",
  },
];

export const FILED_ISSUE: PlmIssue = {
  id: "PLM-1047",
  title: "Understeer in left turns — clamp applied before curvature compensation",
  system: "Control",
  component: "Steering Controller",
  severity: "high",
  status: "open",
  opened: "Jul 5",
  region: "steering",
  source: "blackbox",
  detail: "src/control/steering_controller.cpp · calculateSteeringAngle()",
};

/* Marker positions in CarSchematic viewBox units (220×440, nose up) */
export const REGION_POINTS: Record<CarRegion, { cx: number; cy: number }> = {
  steering: { cx: 110, cy: 108 },
  "front-left-brake": { cx: 36, cy: 112 },
  hvac: { cx: 110, cy: 140 },
  "front-camera": { cx: 110, cy: 178 },
  "driver-door": { cx: 46, cy: 232 },
  battery: { cx: 110, cy: 252 },
};

/* marker/halo are raw CSS-var strings for SVG fill/stroke attributes */
export const SEVERITY_META: Record<
  PlmSeverity,
  { label: string; badge: string; marker: string; halo: string }
> = {
  high: {
    label: "High",
    badge: "bg-anomaly-soft text-anomaly",
    marker: "var(--anomaly)",
    halo: "var(--anomaly-soft)",
  },
  medium: {
    label: "Medium",
    badge: "bg-warning-soft text-warning",
    marker: "var(--warning)",
    halo: "var(--warning-soft)",
  },
  low: {
    label: "Low",
    badge: "bg-secondary text-muted-foreground",
    marker: "var(--muted-foreground)",
    halo: "var(--secondary)",
  },
};

export const STATUS_META: Record<PlmStatus, { label: string; badge: string }> = {
  open: { label: "Open", badge: "bg-secondary text-foreground" },
  "in-review": { label: "In review", badge: "bg-replay-soft text-primary" },
  resolved: { label: "Resolved", badge: "bg-success-soft text-success" },
};
