"use client";
import NavbarButton from "../navbar/NavbarButton";
import NavbarButtonCart from "../navbar/NavbarButtonCart";

export default function NavbarRedirectButtons() {
    const iconWidth: number = 24;

    return (
        <div className="relative flex">
            <NavbarButton iconWidth={iconWidth} iconLink="/favorite.svg" />
            <NavbarButtonCart iconWidth={iconWidth} />
            <NavbarButton hrefProp="/account" iconWidth={iconWidth} iconLink="/account.svg" />
        </div>
    );
}
