import type { PaginationState, SortingState } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { EventsTable } from "./components/EventsTable";
import { Filters } from "./components/Filters";
import { Header } from "./components/Header";
import { useEvents } from "./hooks/useEvents";
import { appMain } from "./styles";
import type { EventLevel, SortField } from "./types";

function App() {
  const [draftFromDate, setDraftFromDate] = useState("");
  const [draftToDate, setDraftToDate] = useState("");
  const [draftMinLevel, setDraftMinLevel] = useState<EventLevel>("INFO");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [minLevel, setMinLevel] = useState<EventLevel>("INFO");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const primarySort = sorting[0];
  const { events, total, isLoading, error } = useEvents({
    fromDate,
    toDate,
    minLevel,
    pageIndex: pagination.pageIndex,
    pageSize: pagination.pageSize,
    sortBy: primarySort?.id as SortField | undefined,
    sortDir: primarySort ? (primarySort.desc ? "desc" : "asc") : undefined,
  });

  useEffect(() => {
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  }, [fromDate, toDate, minLevel]);

  useEffect(() => {
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  }, [sorting]);

  const resetFilters = () => {
    setDraftFromDate("");
    setDraftToDate("");
    setDraftMinLevel("INFO");
    setFromDate("");
    setToDate("");
    setMinLevel("INFO");
  };

  const applyFilters = () => {
    setFromDate(draftFromDate);
    setToDate(draftToDate);
    setMinLevel(draftMinLevel);
  };

  return (
    <main className={appMain}>
      <Header minLevel={minLevel} />
      <Filters
        fromDate={draftFromDate}
        toDate={draftToDate}
        minLevel={draftMinLevel}
        onFromDateChange={setDraftFromDate}
        onToDateChange={setDraftToDate}
        onMinLevelChange={setDraftMinLevel}
        onReset={resetFilters}
        onApply={applyFilters}
      />
      <EventsTable
        events={events}
        total={total}
        pagination={pagination}
        onPaginationChange={setPagination}
        sorting={sorting}
        onSortingChange={setSorting}
        isLoading={isLoading}
        error={error}
      />
    </main>
  );
}

export default App;
