import { AppButton } from "./button/AppButton";

type PaginationButtonProps = {
  label: string;
  onClick: () => void;
  disabled: boolean;
};

export const PaginationButton = ({
  label,
  onClick,
  disabled,
}: PaginationButtonProps) => (
  <AppButton variant="ghost" size="sm" onClick={onClick} disabled={disabled}>
    {label}
  </AppButton>
);
