"use client";

import { ChangeEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import TextSubtitle from "./TextSubtitle";
import { signIn } from "next-auth/react";
import ButtonRectText from "./ButtonRectText";
import { useSession, signOut } from "next-auth/react";

export default function LoginPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams()
    const redirect = searchParams.get("redirect") || "/account"
    const { status } = useSession();
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleFormSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);
        try {
            const result = await signIn("credentials", {
                email: formData.email,
                password: formData.password,
                redirect: false,
            });

            if (result?.error) {
                setError("Can't sign in, Please try again.");
                setIsLoading(false);
                return;
            }
            router.push(redirect);
        } catch (error) {
            setError("An unexpected error occurred");
            setIsLoading(false);
            console.error("Registration error:", error);
        }
    };

    return (
        <main>
            <TextSubtitle>My Account</TextSubtitle>

            {error && <p>{error}</p>}

            {status === "authenticated" && (
                <ButtonRectText
                    onClickProp={() => signOut({ callbackUrl: "/" })}
                    classNameProp="m-auto"
                >
                    SignOut
                </ButtonRectText>
            )}

            {status === "unauthenticated" && (
                <form onSubmit={handleFormSubmit} className="flex flex-col items-center">
                    <label htmlFor="email">Email: </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleFormChange}
                        className="border border-[var(--color-border)] px-1"
                        required
                    />
                    <label htmlFor="password">Password: </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleFormChange}
                        className="border border-[var(--color-border)] px-1"
                        required
                    />
                    <ButtonRectText>
                        <input type="submit" disabled={isLoading} className="cursor-pointer" value={!isLoading ? "Login" : "Logging in..."}/>
                    </ButtonRectText>
                </form>
            )}
        </main>
    );
}
