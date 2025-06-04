import CartPageContent from "@/components/cart/CartPageContent";
import Navbar from "@/components/navbar/Navbar";
import NavbarRedirectButtons from "@/components/_commons/NavbarRedirectButtons";

export default function CartPage() {
    return (
        <>
            <Navbar>
                <NavbarRedirectButtons />
            </Navbar>
            <CartPageContent />
        </>
    );
}
