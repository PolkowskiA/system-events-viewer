import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useEvents } from "./useEvents";
import type { EventsPage } from "../types";

const makeResponse = (data: EventsPage) =>
  Promise.resolve({
    ok: true,
    json: async () => data,
  });

describe("useEvents", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("builds query params and exposes data", async () => {
    const fetchSpy = vi
      .fn()
      .mockReturnValue(
        makeResponse({
          items: [
            {
              id: "1",
              level: "INFO",
              message: "Service started",
              timestamp: "2026-02-08T10:00:00.000Z",
            },
          ],
          total: 1,
          page: 1,
          pageSize: 10,
        }),
      );
    vi.stubGlobal("fetch", fetchSpy);

    const { result } = renderHook(() =>
      useEvents({
        fromDate: "2026-02-07",
        toDate: "2026-02-08",
        minLevel: "WARNING",
        pageIndex: 1,
        pageSize: 10,
        sortBy: "timestamp",
        sortDir: "desc",
      }),
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.total).toBe(1);
    expect(result.current.events).toHaveLength(1);

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const [url] = fetchSpy.mock.calls[0] ?? [];
    expect(String(url)).toContain("from=2026-02-07");
    expect(String(url)).toContain("to=2026-02-08");
    expect(String(url)).toContain("minLevel=WARNING");
    expect(String(url)).toContain("page=2");
    expect(String(url)).toContain("pageSize=10");
    expect(String(url)).toContain("sortBy=timestamp");
    expect(String(url)).toContain("sortDir=desc");
  });

  it("sets error when fetch fails", async () => {
    const fetchSpy = vi.fn().mockResolvedValue({ ok: false });
    vi.stubGlobal("fetch", fetchSpy);

    const { result } = renderHook(() =>
      useEvents({
        fromDate: "",
        toDate: "",
        minLevel: "INFO",
        pageIndex: 0,
        pageSize: 10,
      }),
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.error).toMatch(/unable to fetch events/i);
  });
});
