import Link from "next/link";
import ButtonRectText from "./ButtonRectText";
import CardContainer from "./CardContainer";

export default function FlashMessageLogin() {
    return (
        <CardContainer classNameProp="flex items-center justify-between px-5">
            <span className="inline-block text-sm font-semibold w-35">
                Login to access more features
            </span>
            <div className="flex gap-1">
                <Link href={'/account'}>
                    <ButtonRectText>Login</ButtonRectText>
                </Link>
                <ButtonRectText>SignUp</ButtonRectText>
            </div>
        </CardContainer>
    );
}
