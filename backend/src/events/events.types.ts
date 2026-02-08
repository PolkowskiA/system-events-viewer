export interface SystemEvent {
  id: string;
  level: EventLevel;
  message: string;
  timestamp: string;
}

export interface EventQuery {
  from?: string;
  to?: string;
  minLevel?: EventLevel;
  page?: number;
  pageSize?: number;
  sortBy?: SortField;
  sortDir?: SortDirection;
}

export interface EventsPage {
  items: SystemEvent[];
  total: number;
  page: number;
  pageSize: number;
}

export type SortField = 'level' | 'message' | 'timestamp';
export type SortDirection = 'asc' | 'desc';

export const EVENT_LEVELS = ['DEBUG', 'INFO', 'WARNING', 'ERROR'] as const;
export type EventLevel = (typeof EVENT_LEVELS)[number];
