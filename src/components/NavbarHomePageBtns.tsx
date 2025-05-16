export default function NavbarHomePageBtns({ cartCount }: { cartCount: number }) {
    const iconWIdth: number = 40;

    return (
        <>
            <button className="font-bold bg-green-300 p-2 px-4 rounded-xl ml-2 cursor-pointer hover:bg-green-400">
                <img width={iconWIdth} src="/favorite.svg" alt="" />
            </button>
            <button className="font-bold bg-green-300 p-2 px-4 rounded-xl ml-2 cursor-pointer hover:bg-green-400">
                {cartCount}
                <img width={iconWIdth} src="/cart-shopping.svg" alt="" />
            </button>
            <button className="font-bold bg-green-300 p-2 px-4 rounded-xl ml-2 cursor-pointer hover:bg-green-400">
                <img width={iconWIdth} src="/account.svg" alt="" />
            </button>
        </>
    );
}
