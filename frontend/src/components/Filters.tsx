import { useId, useState } from "react";
import { LEVELS, levelLabels } from "../constants";
import {
  cardBase,
  filtersActions,
  filtersFields,
  inputStyles,
  labelBase,
} from "../styles";
import type { EventLevel } from "../types";
import { AppButton } from "./button/AppButton";

type FiltersProps = {
  fromDate: string;
  toDate: string;
  minLevel: EventLevel;
  onFromDateChange: (value: string) => void;
  onToDateChange: (value: string) => void;
  onMinLevelChange: (value: EventLevel) => void;
  onReset: () => void;
  onApply: () => void;
};

export const Filters = ({
  fromDate,
  toDate,
  minLevel,
  onFromDateChange,
  onToDateChange,
  onMinLevelChange,
  onReset,
  onApply,
}: FiltersProps) => {
  const dateToId = useId();
  const dateFromId = useId();
  const minLevelId = useId();
  const datesErrorId = useId();
  const [datesError, setDatesError] = useState<string>();

  const hasFilters =
    fromDate.length > 0 || toDate.length > 0 || minLevel !== "INFO";

  const handleChangeDateTo = (
    event: React.ChangeEvent<HTMLInputElement, HTMLInputElement>,
  ) => {
    onToDateChange(event.target.value);
  };

  const handleChangeDateFrom = (
    event: React.ChangeEvent<HTMLInputElement, HTMLInputElement>,
  ) => {
    onFromDateChange(event.target.value);
  };

  const validateDates = () => {
    if (fromDate && toDate) {
      if (new Date(toDate).getTime() < new Date(fromDate).getTime()) {
        setDatesError("To date must be equal or after From date.");
        return false;
      } else if (datesError) {
        setDatesError(undefined);
      }
    }
    return true;
  };

  const handleClearFilters = () => {
    setDatesError(undefined);
    onReset();
  };

  const handleFilter = () => {
    const isValid = validateDates();
    if (isValid) onApply();
  };

  return (
    <section className={cardBase}>
      <div className={filtersFields}>
        <label className={labelBase} htmlFor={dateFromId}>
          <span>From date</span>
          <input
            id={dateFromId}
            className={inputStyles({ state: datesError ? "error" : "default" })}
            type="date"
            value={fromDate}
            max={toDate}
            aria-invalid={!!datesError}
            aria-describedby={datesError ? datesErrorId : undefined}
            onChange={handleChangeDateFrom}
            onBlur={validateDates}
          />
        </label>
        <label className={labelBase} htmlFor={dateToId}>
          <span>To date</span>
          <input
            id={dateToId}
            className={inputStyles({ state: datesError ? "error" : "default" })}
            type="date"
            value={toDate}
            min={fromDate}
            aria-invalid={!!datesError}
            aria-describedby={datesError ? datesErrorId : undefined}
            onChange={handleChangeDateTo}
            onBlur={validateDates}
          />
          {datesError && <span id={datesErrorId}>{datesError}</span>}
        </label>
        <label className={labelBase} htmlFor={minLevelId}>
          <span>Minimum level</span>
          <select
            id={minLevelId}
            className={inputStyles()}
            value={minLevel}
            onChange={(event) =>
              onMinLevelChange(event.target.value as EventLevel)
            }
          >
            {LEVELS.map((level) => (
              <option key={level} value={level}>
                {levelLabels[level]}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className={filtersActions}>
        <AppButton
          variant="ghost"
          onClick={handleClearFilters}
          disabled={!hasFilters}
          type="button"
        >
          Clear filters
        </AppButton>
        <AppButton onClick={handleFilter} type="button" disabled={!!datesError}>
          Filter
        </AppButton>
      </div>
    </section>
  );
};
