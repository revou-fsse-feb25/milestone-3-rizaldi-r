import Link from "next/link";

export default function NavbarButton({
    iconWidth,
    iconLink,
    hrefProp,
    iconAlt,
    customMargin = "m-0",
}: {
    iconWidth: number;
    iconLink: string;
    hrefProp?: string
    iconAlt?: string;
    customMargin?: string;
}) {
    return (
        // ISSUE: ml-.. not consistent
        <Link
            className={`inline-flex border-x-2 [border-image:linear-gradient(rgba(191,191,191,0)_10%,rgba(191,191,191,1)_50%,rgba(191,191,191,0)_90%)_1] focus:bg-(image:--gradient-navbar-btn-fill) h-15 w-15 m-[-1px] cursor-pointer ${customMargin}`}
            href={hrefProp || ""}
        >
            <img
                width={iconWidth}
                className="mx-auto filter-[var(--filter-color-text)]"
                src={iconLink}
                alt={iconAlt}
            />
        </Link>
    );
}
