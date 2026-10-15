import * as React from "react"
import { cn } from "cn"

interface EmptyStateProps {
    // icon?: React.ReactNode
    title: string
    description?: string
    action?: React.ReactNode
    className?: string
}

export function EmptyState({
    // icon,
    title,
    description,
    action,
    className,
}: EmptyStateProps) {
    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 bg-card/50 p-8 text-center transition-all sm:p-10",
                className
            )}
        >
            {/* {icon && (
                <div className="mb-1 flex size-13 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-xs">
                    {icon}
                </div>
            )} */}

            <div className="max-w-md space-y-1">
                <h3 className="text-base font-semibold tracking-tight text-foreground">
                    {title}
                </h3>
                {description && (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {description}
                    </p>
                )}
            </div>

            {action && <div className="mt-4">{action}</div>}
        </div>
    )
}
