import Link from "next/link";

import { fetchCategoryList } from "@/services/api";
import { ICategoryData } from "@/types/types";

import HomePageContent from "@/components/home/HomePageContent";
import Navbar from "@/components/navbar/Navbar";
import NavbarRedirectButtons from "@/components/_commons/NavbarRedirectButtons";

// SSR for fetching categories
export default async function HomePage() {
    const categories: ICategoryData[] = await fetchCategoryList();

    return (
        <>
            <Link href="/faq" className="absolute right-2 text-black opacity-50">
                <img width={16} className="inline align-sub mr-[2px]" src="/question.svg" alt="" />
                Help
            </Link>
            <Navbar>
                <NavbarRedirectButtons />
            </Navbar>
            <HomePageContent categories={categories}/>
        </>
    );
}
