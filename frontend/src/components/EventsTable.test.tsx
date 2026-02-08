import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { EventsTable } from "./EventsTable";
import type { SystemEvent } from "../types";

const baseEvents: SystemEvent[] = [
  {
    id: "1",
    level: "INFO",
    message: "Service started",
    timestamp: "2026-02-08T10:00:00.000Z",
  },
  {
    id: "2",
    level: "ERROR",
    message: "Disk full",
    timestamp: "2026-02-08T10:05:00.000Z",
  },
];

const baseProps = {
  events: baseEvents,
  total: baseEvents.length,
  pagination: { pageIndex: 0, pageSize: 10 },
  onPaginationChange: vi.fn(),
  sorting: [],
  onSortingChange: vi.fn(),
  isLoading: false,
  error: null as string | null,
};

describe("EventsTable", () => {
  it("renders rows and total count", () => {
    render(<EventsTable {...baseProps} />);

    expect(screen.getByRole("heading", { name: "Events" })).toBeInTheDocument();
    expect(screen.getByText("2 entries")).toBeInTheDocument();
    expect(screen.getByText("Service started")).toBeInTheDocument();
    expect(screen.getByText("Disk full")).toBeInTheDocument();
  });

  it("shows empty state when there are no events", () => {
    render(
      <EventsTable
        {...baseProps}
        events={[]}
        total={0}
        isLoading={false}
      />,
    );

    expect(
      screen.getByText("No events for the selected filters."),
    ).toBeInTheDocument();
  });

  it("shows error message when error exists", () => {
    render(<EventsTable {...baseProps} error="Backend error" />);

    expect(screen.getByText("Backend error")).toBeInTheDocument();
  });

  it("shows loading indicator in count badge", () => {
    render(<EventsTable {...baseProps} isLoading />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
});
