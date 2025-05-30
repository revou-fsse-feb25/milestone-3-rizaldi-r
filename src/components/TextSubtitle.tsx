export default function TextSubtitle({
    children,
    classNameProp,
}: {
    children: string;
    classNameProp?: string;
}) {
    return <h2 className={` ${classNameProp}  text-sm font-medium 
    `}>{children}</h2>;
}
