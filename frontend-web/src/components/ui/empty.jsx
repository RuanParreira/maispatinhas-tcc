import { cva } from "class-variance-authority";
import { cn } from "cn"

const emptyVariants = cva(
  "group/empty flex w-full min-w-0 flex-1 flex-col items-center justify-center gap-4 text-center text-balance",
  {
    variants: {
      variant: {
        default: "rounded-xl border-dashed p-6",
        card: "rounded-2xl bg-card px-6 py-16 shadow-xs",
        outline: "rounded-2xl border border-dashed border-border px-6 py-14",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Empty({
  className,
  variant = "default",
  ...props
}) {
  return (
    <div
      data-slot="empty"
      data-variant={variant}
      className={cn(emptyVariants({ variant, className }))}
      {...props}
    />
  )
}

function EmptyHeader({
  className,
  ...props
}) {
  return (
    <div
      data-slot="empty-header"
      className={cn("flex max-w-sm flex-col items-center gap-2", className)}
      {...props}
    />
  )
}

const emptyMediaVariants = cva(
  "mb-2 flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        icon: "flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground [&_svg:not([class*='size-'])]:size-4",
        brand: "size-12 rounded-full bg-secondary text-warning [&_svg:not([class*='size-'])]:size-5",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function EmptyMedia({
  className,
  variant = "default",
  ...props
}) {
  return (
    <div
      data-slot="empty-icon"
      data-variant={variant}
      className={cn(emptyMediaVariants({ variant, className }))}
      {...props}
    />
  )
}

function EmptyTitle({
  className,
  ...props
}) {
  return (
    <div
      data-slot="empty-title"
      className={cn(
        "font-heading text-sm font-medium tracking-tight group-data-[variant=card]/empty:text-2xl group-data-[variant=card]/empty:font-normal",
        className
      )}
      {...props}
    />
  )
}

function EmptyDescription({
  className,
  ...props
}) {
  return (
    <div
      data-slot="empty-description"
      className={cn(
        "text-sm/relaxed text-muted-foreground group-data-[variant=card]/empty:text-base [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary",
        className
      )}
      {...props}
    />
  )
}

function EmptyContent({
  className,
  ...props
}) {
  return (
    <div
      data-slot="empty-content"
      className={cn(
        "flex w-full max-w-sm min-w-0 flex-col items-center gap-2.5 text-sm text-balance",
        className
      )}
      {...props}
    />
  )
}

export {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
}
