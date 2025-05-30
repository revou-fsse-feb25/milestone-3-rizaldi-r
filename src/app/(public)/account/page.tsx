import React, { Suspense } from "react";
import Navbar from "@/components/Navbar";
import NavbarRedirectBtns from "@/components/NavbarRedirectBtns";
import AccountPageContent from "@/components/AccountPageContent";

export default function LoginPage() {
    return (
        <>
            <Navbar>
                <NavbarRedirectBtns />
            </Navbar>
            <Suspense fallback={<div>Loading account details...</div>}>
                <AccountPageContent />
            </Suspense>
        </>
    );
}
