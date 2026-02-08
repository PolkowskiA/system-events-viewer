import { useEffect, useMemo, useState } from "react";
import { API_BASE } from "../constants";
import type {
  EventLevel,
  EventsPage,
  SortDirection,
  SortField,
  SystemEvent,
} from "../types";
import { toDateOnly } from "../utils/date";

type EventsFilters = {
  fromDate: string;
  toDate: string;
  minLevel: EventLevel;
  pageIndex: number;
  pageSize: number;
  sortBy?: SortField;
  sortDir?: SortDirection;
};

export const useEvents = ({
  fromDate,
  toDate,
  minLevel,
  pageIndex,
  pageSize,
  sortBy,
  sortDir,
}: EventsFilters) => {
  const [events, setEvents] = useState<SystemEvent[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    const fromValue = toDateOnly(fromDate);
    const toValue = toDateOnly(toDate);
    if (fromValue) {
      params.set("from", fromValue);
    }
    if (toValue) {
      params.set("to", toValue);
    }
    if (minLevel) {
      params.set("minLevel", minLevel);
    }
    params.set("page", String(pageIndex + 1));
    params.set("pageSize", String(pageSize));
    if (sortBy) {
      params.set("sortBy", sortBy);
    }
    if (sortDir) {
      params.set("sortDir", sortDir);
    }
    const value = params.toString();
    return value.length ? `?${value}` : "";
  }, [fromDate, toDate, minLevel, pageIndex, pageSize, sortBy, sortDir]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchEvents = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE}/events${queryString}`, {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error("Backend returned an error.");
        }
        const data = (await response.json()) as EventsPage;
        setEvents(data.items);
        setTotal(data.total);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setError("Unable to fetch events. Check the backend.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
    return () => controller.abort();
  }, [queryString]);

  return { events, total, error, isLoading };
};
