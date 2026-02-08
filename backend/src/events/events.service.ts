import { Injectable } from '@nestjs/common';
import {
  EventLevel,
  EventQuery,
  EventsPage,
  SortDirection,
  SortField,
  SystemEvent,
} from './events.types';

const LEVEL_ORDER: Record<EventLevel, number> = {
  DEBUG: 10,
  INFO: 20,
  WARNING: 30,
  ERROR: 40,
};

const MOCK_EVENTS: SystemEvent[] = [
  {
    id: 'evt-1001',
    level: 'INFO',
    message: 'System startup completed.',
    timestamp: '2026-02-01T06:05:12.000Z',
  },
  {
    id: 'evt-1002',
    level: 'DEBUG',
    message: 'Scheduler initialized with 4 workers.',
    timestamp: '2026-02-01T06:10:42.000Z',
  },
  {
    id: 'evt-1003',
    level: 'WARNING',
    message: 'Disk usage exceeded 80% on volume C.',
    timestamp: '2026-02-01T08:13:05.000Z',
  },
  {
    id: 'evt-1004',
    level: 'ERROR',
    message: 'Failed to start telemetry agent.',
    timestamp: '2026-02-01T08:14:22.000Z',
  },
  {
    id: 'evt-1005',
    level: 'INFO',
    message: 'Recovered telemetry agent after retry.',
    timestamp: '2026-02-01T08:15:11.000Z',
  },
  {
    id: 'evt-1006',
    level: 'WARNING',
    message: 'High memory usage detected in process "node".',
    timestamp: '2026-02-02T10:40:09.000Z',
  },
  {
    id: 'evt-1007',
    level: 'DEBUG',
    message: 'Cache warmup completed.',
    timestamp: '2026-02-02T10:45:33.000Z',
  },
  {
    id: 'evt-1008',
    level: 'ERROR',
    message: 'Database connection pool exhausted.',
    timestamp: '2026-02-02T12:07:49.000Z',
  },
  {
    id: 'evt-1009',
    level: 'INFO',
    message: 'Connection pool recovered to healthy state.',
    timestamp: '2026-02-02T12:09:10.000Z',
  },
  {
    id: 'evt-1010',
    level: 'WARNING',
    message: 'Clock drift detected: 2.4s.',
    timestamp: '2026-02-02T15:28:19.000Z',
  },
  {
    id: 'evt-1011',
    level: 'DEBUG',
    message: 'Job "nightly-backup" scheduled.',
    timestamp: '2026-02-03T01:00:00.000Z',
  },
  {
    id: 'evt-1012',
    level: 'INFO',
    message: 'Nightly backup started.',
    timestamp: '2026-02-03T01:01:10.000Z',
  },
  {
    id: 'evt-1013',
    level: 'ERROR',
    message: 'Nightly backup failed: timeout after 30m.',
    timestamp: '2026-02-03T01:31:10.000Z',
  },
  {
    id: 'evt-1014',
    level: 'INFO',
    message: 'User "admin" logged in from 10.0.0.5.',
    timestamp: '2026-02-03T09:22:54.000Z',
  },
  {
    id: 'evt-1015',
    level: 'WARNING',
    message: 'Multiple failed login attempts detected.',
    timestamp: '2026-02-03T09:25:12.000Z',
  },
  {
    id: 'evt-1016',
    level: 'DEBUG',
    message: 'Feature flag "beta-dashboard" enabled.',
    timestamp: '2026-02-03T11:11:11.000Z',
  },
  {
    id: 'evt-1017',
    level: 'INFO',
    message: 'System update available: 1.4.2.',
    timestamp: '2026-02-03T16:04:00.000Z',
  },
  {
    id: 'evt-1018',
    level: 'ERROR',
    message: 'Update download failed: checksum mismatch.',
    timestamp: '2026-02-03T16:06:30.000Z',
  },
  {
    id: 'evt-1019',
    level: 'WARNING',
    message: 'Network latency above threshold.',
    timestamp: '2026-02-04T07:02:15.000Z',
  },
  {
    id: 'evt-1020',
    level: 'INFO',
    message: 'Network latency back to normal.',
    timestamp: '2026-02-04T07:05:47.000Z',
  },
];

type UtcDateRange = {
  start?: Date;
  end?: Date;
};

const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const normalizeDateOnly = (value?: string): string | undefined => {
  if (!value) {
    return undefined;
  }
  const candidate = value.includes('T') ? value.slice(0, 10) : value;
  return DATE_ONLY_PATTERN.test(candidate) ? candidate : undefined;
};

const toUtcRange = (value?: string): UtcDateRange => {
  const normalized = normalizeDateOnly(value);
  if (!normalized) {
    return {};
  }
  const [year, month, day] = normalized.split('-').map(Number);
  if (!year || !month || !day) {
    return {};
  }
  const start = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
  const end = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));
  return { start, end };
};

const isOnOrAfter = (value: Date, boundary?: Date) =>
  !boundary || value >= boundary;

const isOnOrBefore = (value: Date, boundary?: Date) =>
  !boundary || value <= boundary;

const getSortValue = (event: SystemEvent, sortBy: SortField) => {
  switch (sortBy) {
    case 'level':
      return LEVEL_ORDER[event.level];
    case 'timestamp':
      return event.timestamp;
    case 'message':
      return event.message;
    default:
      return event.timestamp;
  }
};

const compareValues = (
  left: SystemEvent,
  right: SystemEvent,
  sortBy: SortField,
  sortDir: SortDirection,
) => {
  const leftValue = getSortValue(left, sortBy);
  const rightValue = getSortValue(right, sortBy);
  if (leftValue === rightValue) {
    return 0;
  }
  const direction = sortDir === 'asc' ? 1 : -1;
  return leftValue > rightValue ? direction : -direction;
};

@Injectable()
export class EventsService {
  list(query: EventQuery): EventsPage {
    const minLevelValue = query.minLevel
      ? LEVEL_ORDER[query.minLevel]
      : undefined;
    const { start: fromDate } = toUtcRange(query.from);
    const { end: toDate } = toUtcRange(query.to);

    const filtered = MOCK_EVENTS.filter((event) => {
      if (minLevelValue && LEVEL_ORDER[event.level] < minLevelValue) {
        return false;
      }

      const eventDate = new Date(event.timestamp);
      return (
        isOnOrAfter(eventDate, fromDate) && isOnOrBefore(eventDate, toDate)
      );
    });

    const sortBy = query.sortBy ?? 'timestamp';
    const sortDir = query.sortDir ?? 'desc';
    const sorted = [...filtered].sort((a, b) =>
      compareValues(a, b, sortBy, sortDir),
    );

    const total = sorted.length;
    const requestedPage = query.page ?? 1;
    const requestedPageSize = query.pageSize ?? 10;
    const pageSize = Math.min(Math.max(requestedPageSize, 1), 100);
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const page = Math.min(Math.max(requestedPage, 1), totalPages);
    const startIndex = (page - 1) * pageSize;
    const items = sorted.slice(startIndex, startIndex + pageSize);

    return {
      items,
      total,
      page,
      pageSize,
    };
  }
}
