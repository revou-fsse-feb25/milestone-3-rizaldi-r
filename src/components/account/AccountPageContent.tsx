"use client";

import { ChangeEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { signIn } from "next-auth/react";

import TextSubheading from "../_commons/TextSubheading";
import ButtonRegular from "../_commons/ButtonRegular";

export default function LoginPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get("redirect");
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
            // console.log(" searchParams", searchParams);
            // console.log(" redirect", redirect)

            // ISSUE: in build version, router.push not working
            router.refresh();
            if (redirect) router.push(redirect);
        } catch (error) {
            setError("An unexpected error occurred");
            setIsLoading(false);
            console.error("Registration error:", error);
        }
    };

    return (
        <main>
            <TextSubheading>My Account</TextSubheading>

            {error && <p>{error}</p>}

            {status === "authenticated" && (
                <ButtonRegular onClickProp={() => signOut({ callbackUrl: "/" })}>
                    SignOut
                </ButtonRegular>
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
                    <ButtonRegular>
                        <input
                            type="submit"
                            disabled={isLoading}
                            className="cursor-pointer"
                            value={!isLoading ? "Login" : "Logging in..."}
                        />
                    </ButtonRegular>
                </form>
            )}
        </main>
    );
}
