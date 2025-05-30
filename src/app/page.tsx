import { cookies } from "next/headers";
import Link from "next/link";

import HomePageContent from "@/components/HomePageContent";
import Navbar from "@/components/Navbar";
import NavbarRedirectBtns from "@/components/NavbarRedirectBtns";

export default async function HomePage() {
    return (
        <>
            <Link href="/faq" className="absolute right-2 text-black opacity-50">
                <img width={16} className="inline align-sub mr-[2px]" src="/question.svg" alt="" />
                Help
            </Link>
            <Navbar>
                <NavbarRedirectBtns />
            </Navbar>
            <HomePageContent />
        </>
    );
}
