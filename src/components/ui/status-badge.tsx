import { cn } from "@/lib/utils";
import { Check, AlertTriangle, X } from "lucide-react";

type BadgeVariant = "success" | "warning" | "error" | "default";

interface StatusBadgeProps {
  variant: BadgeVariant;
  children?: React.ReactNode;
  showIcon?: boolean;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: "bg-success-light text-success",
  warning: "bg-warning-light text-warning",
  error: "bg-error-light text-error",
  default: "bg-muted text-muted-foreground",
};

const icons: Record<BadgeVariant, React.ReactNode> = {
  success: <Check className="h-3 w-3" />,
  warning: <AlertTriangle className="h-3 w-3" />,
  error: <X className="h-3 w-3" />,
  default: null,
};

export function StatusBadge({ 
  variant, 
  children, 
  showIcon = true,
  className 
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
        variantStyles[variant],
        className
      )}
    >
      {showIcon && icons[variant]}
      {children}
    </span>
  );
}
