import { ReactNode } from "react";

export default function CardContainer({
    children,
    classNameProp,
}: {
    children: ReactNode;
    classNameProp?: string;
}) {
    return (
        <div
            className={`bg-(image:--gradient-card-fill) rounded-sm p-2 relative border border-[var(--color-border)] ${classNameProp}`}
        >
            {children}
        </div>
    );
}
