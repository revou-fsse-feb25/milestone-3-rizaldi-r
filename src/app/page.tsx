import { cookies } from "next/headers";
import Link from "next/link";

import HomePageContent from "@/components/HomePageContent";
import Navbar from "@/components/Navbar";
import NavbarHomePage from "@/components/NavbarHomePageBtns";

export default async function HomePage() {
    const cookie = await cookies();
    const cartCount = cookie.get("cartCount")?.value;

    // TODO: add to utils
    async function setCookieCartCount() {
        "use server";
        const cookie = await cookies();
        cookie.set("cartCount", cookie.has("cartCount") ? parseInt(cartCount) + 1 : 1);
    }

    return (
        <>
            <Link href="/faq"><img width={16} className="inline align-bottom" src="/question.svg" alt="" />Help</Link>
            <Navbar componentButtons={<NavbarHomePage cartCount={cartCount} />} />
            <HomePageContent setCookieCartCount={setCookieCartCount} />
        </>
    );
}
