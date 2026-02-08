import { flexRender, type Row } from "@tanstack/react-table";
import { tableCell, tableRow } from "../styles";
import type { SystemEvent } from "../types";

type EventsTableRowProps = {
  row: Row<SystemEvent>;
};

export const EventsTableRow = ({ row }: EventsTableRowProps) => (
  <tr className={tableRow}>
    {row.getVisibleCells().map((cell) => (
      <td key={cell.id} className={tableCell}>
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </td>
    ))}
  </tr>
);
