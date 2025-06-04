import { useEffect, useState } from "react";
import NavbarButton from "./NavbarButton";
import { useCartContext } from "@/contexts/CartContext";

export default function NavbarButtonCart({ iconWidth }: { iconWidth: number }) {
    const [isClient, setIsClient] = useState(false);
    const { totalItems } = useCartContext();

    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <div className="relative">
            {/* avoid prerender when using localStorage */}
            {isClient && (
                <div className="absolute top-1 right-1 bg-[var(--color-text)]  rounded-full text-white text-center p-2 py-1 opacity-80 pointer-events-none">
                    {totalItems}
                </div>
            )}
            <NavbarButton iconWidth={iconWidth} iconLink="/cart.svg" hrefProp="/cart" />
        </div>
    );
}
