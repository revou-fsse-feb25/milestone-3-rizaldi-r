import CartPageContent from "@/components/CartPageContent";
import Navbar from "@/components/Navbar";
import NavbarRedirectBtns from "@/components/NavbarRedirectBtns";

export default function CartPage() {
    return (
        <>
            <Navbar>
                <NavbarRedirectBtns />
            </Navbar>
            <CartPageContent />
        </>
    );
}
