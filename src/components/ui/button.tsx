import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md text-md font-bold transition-colors disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      variant: {
        solid:
          "bg-gold text-white border border-gold [[data-theme=dark]_&]:text-[#16130a]",
        outline:
          "bg-surface-2 text-ink border border-line hover:bg-accent-soft",
        ghost:
          "bg-transparent text-ink border border-line hover:bg-accent-soft",
        icon: "bg-transparent text-muted hover:bg-accent-soft hover:text-ink rounded-md",
      },
      size: {
        default: "h-9 px-4",
        sm: "h-8 px-3",
        icon: "h-8 w-8 p-0",
      },
    },
    defaultVariants: {
      variant: "outline",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
