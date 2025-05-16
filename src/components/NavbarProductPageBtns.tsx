export default function NavbarProductPageBtns({
    cartCount,
    setCookieCartCount,
}: {
    cartCount: number;
    setCookieCartCount: VoidFunction;
}) {
    return (
        <>
            <button className="font-bold bg-green-300 p-2 px-4 rounded-xl ml-2 cursor-pointer hover:bg-green-400">
                Save
            </button>
            <button
                onClick={setCookieCartCount}
                className="font-bold bg-green-300 p-2 px-4 rounded-xl ml-2 cursor-pointer hover:bg-green-400"
            >
                {cartCount}
                Add to Cart
            </button>
        </>
    );
}
