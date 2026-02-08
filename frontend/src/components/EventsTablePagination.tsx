import type { PaginationState, Table } from "@tanstack/react-table";
import {
  paginationControls,
  paginationLabel,
  paginationRoot,
  paginationSelect,
  paginationStatus,
} from "../styles";
import type { SystemEvent } from "../types";
import { PaginationButton } from "./PaginationButton";

type EventsTablePaginationProps = {
  table: Table<SystemEvent>;
  pagination: PaginationState;
};

export const EventsTablePagination = ({
  table,
  pagination,
}: EventsTablePaginationProps) => {
  const pageCount = table.getPageCount();
  return (
    <div className={paginationRoot}>
      <div className={paginationStatus}>
        {table.getRowCount() > 0 &&
          `Page ${pagination.pageIndex + 1} of ${pageCount}`}
      </div>
      <div className={paginationControls}>
        <PaginationButton
          label="First"
          onClick={() => table.firstPage()}
          disabled={!table.getCanPreviousPage()}
        />
        <PaginationButton
          label="Prev"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        />
        <PaginationButton
          label="Next"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        />
        <PaginationButton
          label="Last"
          onClick={() => table.lastPage()}
          disabled={!table.getCanNextPage()}
        />
        <span className={paginationLabel}>Rows per page</span>
        <select
          name="pageSize"
          className={paginationSelect}
          value={pagination.pageSize}
          onChange={(event) => table.setPageSize(Number(event.target.value))}
        >
          {[5, 10, 20, 50].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
