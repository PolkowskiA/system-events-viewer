import { cva } from "class-variance-authority";
import { tw } from "../lib/tw";

export const cardBase = tw`grid gap-4 rounded-xl border border-border bg-white p-6 shadow-small`;

export const labelBase = tw`w-full flex flex-col gap-2 text-sm text-muted`;

export const inputStyles = cva(
  "border-border text-ink shadow-small focus:border-accent focus:ring-accent rounded-xl border bg-white px-3 py-2 focus:ring focus:outline-none",
  {
    variants: {
      state: {
        default: "",
        error: "border-error",
      },
    },
    defaultVariants: {
      state: "default",
    },
  },
);
