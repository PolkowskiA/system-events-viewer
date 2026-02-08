import { cva } from "class-variance-authority";
import { tw } from "../lib/tw";

export const tableHeader = tw`flex justify-between gap-4`;
export const tableTitle = tw`text-ink text-2xl font-semibold`;
export const tableCountBadge = tw`bg-accent-20 text-accent-strong rounded-full px-4 py-2 text-xs`;
export const tableError = tw`bg-bg text-error mt-4 rounded-xl px-4 py-3 text-sm`;
export const tableWrapper = tw`mt-4 overflow-x-auto`;
export const tableBase = tw`w-full border-collapse text-sm`;
export const tableEmpty = tw`text-muted py-5 text-sm`;
export const tableHead = tw`text-left`;
export const tableHeaderCell = tw`border-border text-muted border-b px-3 py-3 text-left text-xs tracking-[0.08em] uppercase`;
export const tableHeaderSortIcon = tw`text-muted text-xs`;
export const tableRow = tw`hover:bg-accent-5 transition-colors`;
export const tableCell = tw`border-border text-ink border-b px-3 py-3 text-left text-sm`;
export const tableHeaderButton = cva(
  "text-muted inline-flex items-center gap-2 bg-white px-4 py-2 text-xs tracking-[0.12em] uppercase",
  {
    variants: {
      sortable: {
        true: "cursor-pointer",
        false: "cursor-default",
      },
    },
    defaultVariants: {
      sortable: false,
    },
  },
);

export const levelBadgeStyles = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-[0.08em] uppercase",
  {
    variants: {
      level: {
        DEBUG: "text-debug bg-debug-15",
        INFO: "text-info bg-info-15",
        WARNING: "text-warning bg-warning-15",
        ERROR: "text-error bg-error-15",
      },
    },
    defaultVariants: {
      level: "INFO",
    },
  },
);
