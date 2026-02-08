import { cn } from "../../lib/cn";
import {
  buttonStyles,
  type ButtonSize,
  type ButtonVariant,
} from "../../styles";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function AppButton({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={cn(buttonStyles({ variant, size }), className)}
    />
  );
}
