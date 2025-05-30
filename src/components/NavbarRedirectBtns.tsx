"use client";
import NavbarButton from "./NavbarButton";
import NavbarButtonCart from "./NavbarButtonCart";

export default function NavbarRedirectBtns() {
    const iconWidth: number = 24;

    return (
        <div className="relative flex">
            <NavbarButton iconWidth={iconWidth} iconLink="/favorite.svg" />
            <NavbarButtonCart iconWidth={iconWidth} />
            <NavbarButton hrefProp="/account" iconWidth={iconWidth} iconLink="/account.svg" />
        </div>
    );
}
