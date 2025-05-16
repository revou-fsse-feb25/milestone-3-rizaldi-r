import { cookies } from "next/headers";
import Link from "next/link";

import HomePageContent from "@/components/HomePageContent";
import Navbar from "@/components/Navbar";
import NavbarHomePage from "@/components/NavbarHomePageBtns";

export default async function HomePage() {
    const cookie = await cookies();
    const tempCartCount = cookie.get("cartCount")?.value;
    const cartCount = tempCartCount ? parseInt(tempCartCount, 10) : 0; 

    // TODO: add to utils
    async function setCookieCartCount() {
        "use server";
        const cookie = await cookies();
        // cookie.set("cartCount", cookie.has("cartCount") ? parseInt(cartCount) + 1 : 1);
        cookie.set("cartCount", (cookie.has("cartCount") ? cartCount + 1 : 1).toString());
    }

    return (
        <>
            <Link href="/faq"><img width={16} className="inline align-bottom" src="/question.svg" alt="" />Help</Link>
            <Navbar componentButtons={<NavbarHomePage cartCount={cartCount} />} />
            <HomePageContent setCookieCartCount={setCookieCartCount} />
        </>
    );
}
