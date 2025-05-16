import { ComponentClass, ReactNode } from "react";
import Link from "next/link";
import NavbarHomePage from "./NavbarHomePageBtns";

export default function Navbar({ componentButtons }: { componentButtons: ReactNode }) {
    return (
        <nav className="w-[var(--width-body)] h-16 flex mt-4 fixed bottom-0 z-10">
            <Link
                href={"/"}
                className="font-bold bg-gray-300 p-2 px-4 rounded-xl cursor-pointer hover:bg-gray-300"
            >
                <img width={40} src="/explore.svg" alt="" />
            </Link>
            {componentButtons}
        </nav>
    );
}
