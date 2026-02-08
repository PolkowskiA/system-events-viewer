import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Filters } from "./Filters";

const baseProps = {
  fromDate: "",
  toDate: "",
  minLevel: "INFO" as const,
  onFromDateChange: vi.fn(),
  onToDateChange: vi.fn(),
  onMinLevelChange: vi.fn(),
  onReset: vi.fn(),
  onApply: vi.fn(),
};

describe("Filters", () => {
  it("does not apply when dates are invalid and shows error", async () => {
    const user = userEvent.setup();
    render(
      <Filters
        {...baseProps}
        fromDate="2026-02-08"
        toDate="2026-02-07"
      />,
    );

    const toInput = screen.getByLabelText("To date");
    await user.click(toInput);
    await user.tab();

    expect(
      screen.getByText("To date must be equal or after From date."),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Filter" }));
    expect(baseProps.onApply).not.toHaveBeenCalled();
  });

  it("applies when dates are valid", async () => {
    const user = userEvent.setup();
    render(
      <Filters
        {...baseProps}
        fromDate="2026-02-07"
        toDate="2026-02-08"
      />,
    );

    await user.click(screen.getByRole("button", { name: "Filter" }));
    expect(baseProps.onApply).toHaveBeenCalledTimes(1);
  });
});
