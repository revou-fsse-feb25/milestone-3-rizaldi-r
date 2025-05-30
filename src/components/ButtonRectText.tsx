import React from "react";

export default function ButtonRectText({
    children,
    type="button",
    customPadding = "px-3 py-1",
    customFontWeight = "font-bold",
    classNameProp,
    onClickProp = () => {},
}: {
    children: string | React.ReactNode;
    type?: "button" | "submit" | "reset";
    customPadding?: string;
    customFontWeight?: string;
    classNameProp?: string;
    onClickProp?: () => void;
}) {
    return (
        <button
            onClick={onClickProp}
            type={type}
            className={`border-[var(--color-border)]  bg-(image:--gradient-btn-glare) hover:bg-gray-300  border rounded-xl cursor-pointer focus:border-[var(--color-border-active)] p-[3px] group snap-center ${classNameProp}`}
        >
            <span
                className={`block items-center bg-(image:--gradient-btn-fill) group-focus:shadow-[var(--shadow-btn-active)] group-hover:shadow-[var(--shadow-btn-active)] rounded-[8px] opacity-80 whitespace-nowrap h-full w-full text-center mt-auto ${customFontWeight} ${customPadding}`}
            >
                {children}
            </span>
        </button>
    );
}
