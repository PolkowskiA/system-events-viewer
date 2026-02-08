import type { EventLevel } from "./types";

export const LEVELS: EventLevel[] = ["DEBUG", "INFO", "WARNING", "ERROR"];
export const API_BASE =
  import.meta.env.VITE_API_URL ?? "http://192.168.0.179:3000";

export const levelLabels: Record<EventLevel, string> = {
  DEBUG: "Debug",
  INFO: "Info",
  WARNING: "Warning",
  ERROR: "Error",
};

export const levelDescriptions: Record<EventLevel, string> = {
  DEBUG: "All events, including debug.",
  INFO: "Info and higher levels.",
  WARNING: "Warnings and errors.",
  ERROR: "Errors only.",
};
