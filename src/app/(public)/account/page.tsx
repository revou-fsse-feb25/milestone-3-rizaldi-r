import React, { Suspense } from "react";
import Navbar from "@/components/navbar/Navbar";
import NavbarRedirectButtons from "@/components/_commons/NavbarRedirectButtons";
import AccountPageContent from "@/components/account/AccountPageContent";

export default function LoginPage() {
    return (
        <>
            <Navbar>
                <NavbarRedirectButtons />
            </Navbar>
            <Suspense fallback={<div>Loading account details...</div>}>
                <AccountPageContent />
            </Suspense>
        </>
    );
}
