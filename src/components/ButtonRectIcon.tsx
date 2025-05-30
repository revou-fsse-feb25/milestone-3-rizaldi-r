export default function ButtonRectIcon({
    iconLink,
    iconSize,
    customPadding = "p-2",
    classNameProp,
    onClickProp = () => {},
}: {
    iconLink: string;
    iconSize: number;
    customPadding? : string
    classNameProp?: string,
    onClickProp?: () => void;
}) {
    return (
        <button
            onClick={onClickProp}
            className="border-[var(--color-border)] bg-(image:--gradient-btn-glare) hover:bg-gray-300  border font-bold rounded-md cursor-pointer hover:border-[var(--color-border-active)] p-[2px] group"
        >
            <span className={`block h-full bg-(image:--gradient-btn-fill) group-hover:shadow-[var(--shadow-btn-active)] active:shadow-[var(--shadow-btn-active)] rounded-sm opacity-80 ${customPadding} ${classNameProp}`}>
                <img className="filter-[var(--filter-color-text)]" width={iconSize} src={iconLink} alt="" />
            </span>
        </button>
    );
}
