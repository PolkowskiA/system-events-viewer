export type EventLevel = "DEBUG" | "INFO" | "WARNING" | "ERROR";

export type SystemEvent = {
  id: string;
  level: EventLevel;
  message: string;
  timestamp: string;
};

export type EventsPage = {
  items: SystemEvent[];
  total: number;
  page: number;
  pageSize: number;
};

export type SortField = "level" | "message" | "timestamp";
export type SortDirection = "asc" | "desc";
