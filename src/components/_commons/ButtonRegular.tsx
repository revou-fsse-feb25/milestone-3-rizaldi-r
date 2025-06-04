"use client";

type FontWeight =
    | "font-light"
    | "font-normal"
    | "font-medium"
    | "font-semibold"
    | "font-bold"
    | "font-extrabold";

export default function ButtonRegular({
    children,
    type = "button",
    iconLink,
    iconSize,
    isRound,
    customFontWeight = "font-bold",
    customPadding,
    customClassName,
    onClickProp = () => {},
}: {
    children?: React.ReactNode;
    type?: "button" | "submit" | "reset";
    iconLink?: string;
    iconSize?: number;
    isRound?: boolean;
    customFontWeight?: FontWeight;
    customPadding?: { x?: number; y?: number };
    customClassName?: string;
    onClickProp?: () => void;
}) {
    const paddingMap: { [key: number]: { x: string; y: string } } = {
        0: { x: "px-0", y: "py-0" },
        0.5: { x: "px-0.5", y: "py-0.5" },
        1: { x: "px-1", y: "py-1" },
        1.5: { x: "px-1.5", y: "py-1.5" },
        2: { x: "px-2", y: "py-2" },
        2.5: { x: "px-2.5", y: "py-2.5" },
        3: { x: "px-3", y: "py-3" },
        3.5: { x: "px-3.5", y: "py-3.5" },
        4: { x: "px-4", y: "py-4" },
        5: { x: "px-5", y: "py-5" },
        6: { x: "px-6", y: "py-6" },
        7: { x: "px-7", y: "py-7" },
        8: { x: "px-8", y: "py-8" },
    };
    const defaultPaddingValue: number = 2;

    // Handle padding
    let finalPadding: string = "px-2 py-2";
    if (customPadding) {
        const pxValue = customPadding.x !== undefined ? customPadding.x : defaultPaddingValue;
        const pyValue = customPadding.y !== undefined ? customPadding.y : defaultPaddingValue;

        const pxClass = paddingMap[pxValue]?.x;
        const pyClass = paddingMap[pyValue]?.y;

        finalPadding = `${pxClass} ${pyClass}`;
    } else if (children) {
        finalPadding = "px-3 py-2";
    }

    // Handle rounding
    let outerRounding: string = "rounded-md";
    let innerRounding: string = "rounded-sm";
    if (children) {
        outerRounding = "rounded-xl";
        innerRounding = "rounded-[8px]";
    }

    return (
        <button
            onClick={onClickProp}
            type={type}
            className={`border-[var(--color-border)] bg-(image:--gradient-btn-glare) hover:bg-gray-300  border font-bold cursor-pointer hover:border-[var(--color-border-active)] p-[2px] group ${
                isRound ? "rounded-full" : outerRounding
            }`}
        >
            <span
                className={`block leading-[75%] h-full bg-(image:--gradient-btn-fill) group-hover:shadow-[var(--shadow-btn-active)] active:shadow-[var(--shadow-btn-active)] opacity-80 ${finalPadding} ${
                    isRound ? "rounded-full" : innerRounding
                } ${customClassName} `}
            >
                {iconLink && (
                    <img
                        className="inline filter-[var(--filter-color-text)]"
                        width={iconSize}
                        src={iconLink}
                        alt=""
                    />
                )}
                {children && (
                    <span className={`${customFontWeight} ${iconLink ? "ml-1" : ""}`}>
                        {children}
                    </span>
                )}
            </span>
        </button>
    );
}
