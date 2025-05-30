import { ReactNode } from "react";
import Link from "next/link";

export default function Navbar({ children }: { children: ReactNode }) {
    return (
        <nav className="w-[var(--width-body)] left-[calc(50%-var(--width-body)/2)] h-[var(--height-navbar)] flex justify-center fixed bottom-0 z-2 bg-(image:--gradient-navbar-fill) border border-[var(--color-border)] rounded-xl items-center backdrop-blur-sm">
            <Link
                href={"/"}
                className="relative bg-(image:--gradient-exlore-btn-fill) rounded-full border w-14 h-14 flex justify-center mr-5"
            >
                <img className="absolute w-full" src="/glare.svg" alt="" />
                <img className="w-7 filter-[var(--filter-color-text)]" src="/explore.svg" alt="" />
            </Link>
            {children}
        </nav>
    );
}

// calc(50% - var(--width-body)/2)
