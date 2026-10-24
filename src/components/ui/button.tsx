import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Button recipe from the DotOneScan design system, retinted gold/black.
 * - solid: the one primary action per view (gold fill, near-black label)
 * - outline: secondary toolbar action, 2px stroke that turns gold on hover
 * - ghost / icon: utility actions, gold-tinted hover surface
 * Heights follow the size ramp: md 40, sm 32, icon 32.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-md font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      variant: {
        solid:
          "border border-accent bg-accent text-accent-ink hover:border-accent-hover hover:bg-accent-hover",
        outline:
          "border-2 border-line-2 bg-transparent text-ink hover:border-accent hover:text-gold",
        ghost:
          "border border-transparent bg-transparent text-ink hover:bg-accent-soft",
        icon: "rounded-lg bg-transparent text-muted hover:bg-accent-soft hover:text-gold",
      },
      size: {
        default: "h-10 px-4",
        sm: "h-8 px-3 text-sm",
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
