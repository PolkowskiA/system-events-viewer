import { flexRender, type Table } from "@tanstack/react-table";
import {
  tableHead,
  tableHeaderButton,
  tableHeaderCell,
  tableHeaderSortIcon,
} from "../styles";
import type { SystemEvent } from "../types";

type EventsTableHeadProps = {
  table: Table<SystemEvent>;
};

export const EventsTableHead = ({ table }: EventsTableHeadProps) => (
  <thead className={tableHead}>
    {table.getHeaderGroups().map((headerGroup) => (
      <tr key={headerGroup.id}>
        {headerGroup.headers.map((header) => (
          <th key={header.id} className={tableHeaderCell}>
            {header.isPlaceholder ? null : (
              <button
                type="button"
                className={tableHeaderButton({
                  sortable: header.column.getCanSort(),
                })}
                onClick={header.column.getToggleSortingHandler()}
                disabled={!header.column.getCanSort()}
              >
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext(),
                )}
                <span className={tableHeaderSortIcon}>
                  {header.column.getIsSorted() === "asc"
                    ? "▲"
                    : header.column.getIsSorted() === "desc" && "▼"}
                </span>
              </button>
            )}
          </th>
        ))}
      </tr>
    ))}
  </thead>
);
