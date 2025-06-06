"use client";

import { ChangeEvent, useState, useEffect } from "react";
import { useRouter, useSearchParams, redirect } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { signIn, SignInOptions } from "next-auth/react";

import TextSubheading from "../_commons/TextSubheading";
import ButtonRegular from "../_commons/ButtonRegular";

export default function LoginPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get("redirect");
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
            
            // ISSUE: in build version, router.push not working
            // to access checkout page, it needs to be fully reloaded 
            // reload the signin state
            location.reload();
            if (redirectTo) router.replace(redirectTo);

            // router.refresh();
            // if (redirectTo) {
            //     // console.log("Redirecting to:", redirectTo);
            //     // router.push(redirectTo);
            //     // location.reload();
            //     router.replace(redirectTo);
            //     // window.location.href = redirectTo;
            // }
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

            {status === "authenticated" ? (
                <ButtonRegular onClickProp={() => signOut({ callbackUrl: "/" })}>
                    SignOut
                </ButtonRegular>
            ) : (
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
                    <ButtonRegular type={"submit"} isDisabled={isLoading}>
                        {!isLoading ? "Login" : "Logging in..."}
                    </ButtonRegular>
                </form>
            )}
        </main>
    );
}
