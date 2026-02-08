import {
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type Getter,
  type OnChangeFn,
  type PaginationState,
  type SortingState,
} from "@tanstack/react-table";
import { useMemo } from "react";
import {
  cardBase,
  levelBadgeStyles,
  tableBase,
  tableCountBadge,
  tableEmpty,
  tableError,
  tableHeader,
  tableTitle,
  tableWrapper,
  timestampText,
} from "../styles";
import type { SystemEvent } from "../types";
import { formatTimestamp } from "../utils/date";
import { EventsTableHead } from "./EventsTableHead";
import { EventsTablePagination } from "./EventsTablePagination";
import { EventsTableRow } from "./EventsTableRow";

type EventsTableProps = {
  events: SystemEvent[];
  total: number;
  pagination: PaginationState;
  onPaginationChange: OnChangeFn<PaginationState>;
  sorting: SortingState;
  onSortingChange: OnChangeFn<SortingState>;
  isLoading: boolean;
  error: string | null;
};

const LevelCell = ({ getValue }: { getValue: Getter<unknown> }) => {
  const level = getValue<SystemEvent["level"]>();
  return <span className={levelBadgeStyles({ level })}>{level}</span>;
};

const TimestampCell = ({ getValue }: { getValue: Getter<unknown> }) => {
  const timestamp = getValue<SystemEvent["timestamp"]>();
  return <span className={timestampText}>{formatTimestamp(timestamp)}</span>;
};

export const EventsTable = ({
  events,
  total,
  pagination,
  onPaginationChange,
  sorting,
  onSortingChange,
  isLoading,
  error,
}: EventsTableProps) => {
  const columns = useMemo<ColumnDef<SystemEvent>[]>(
    () => [
      {
        accessorKey: "level",
        header: "Level",
        enableSorting: true,
        cell: LevelCell,
      },
      {
        accessorKey: "message",
        header: "Message",
        enableSorting: true,
      },
      {
        accessorKey: "timestamp",
        header: "Timestamp",
        enableSorting: true,
        cell: TimestampCell,
      },
    ],
    [],
  );

  const table = useReactTable({
    data: events,
    columns,
    state: { pagination, sorting },
    manualPagination: true,
    manualSorting: true,
    rowCount: total,
    onPaginationChange,
    onSortingChange,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <section className={cardBase}>
      <div className={tableHeader}>
        <div>
          <h2 className={tableTitle}>Events</h2>
        </div>
        <div className={tableCountBadge}>
          {isLoading ? "Loading..." : `${total} entries`}
        </div>
      </div>
      {error ? <div className={tableError}>{error}</div> : null}
      <div className={tableWrapper}>
        <table className={tableBase}>
          <EventsTableHead table={table} />
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <EventsTableRow key={row.id} row={row} />
            ))}
          </tbody>
        </table>
        {!isLoading && events.length === 0 ? (
          <div className={tableEmpty}>No events for the selected filters.</div>
        ) : null}
      </div>
      <EventsTablePagination table={table} pagination={pagination} />
    </section>
  );
};
