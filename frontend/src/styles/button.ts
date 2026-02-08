import { cva, type VariantProps } from "class-variance-authority";

export const buttonStyles = cva(
  "shadow-small box-border inline-flex cursor-pointer items-center justify-center rounded-full text-xs tracking-[0.12em] uppercase transition-all duration-200 hover:-translate-y-px hover:shadow disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none",
  {
    variants: {
      variant: {
        primary: "bg-accent-strong hover:bg-accent text-white",
        ghost:
          "border-accent hover:bg-accent-5 text-accent-strong disabled:border-muted border bg-white disabled:transition-none disabled:hover:translate-y-0 disabled:hover:bg-white disabled:hover:shadow-none",
      },
      size: {
        md: "px-4 py-2",
        sm: "px-3 py-1.5",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export type ButtonVariant = VariantProps<typeof buttonStyles>["variant"];
export type ButtonSize = VariantProps<typeof buttonStyles>["size"];
