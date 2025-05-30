import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

interface ProfileApiResponse {
    id: number;
    email: string;
    name: string;
    role: string;
    avatar: string;
    access_token: string;
}

declare module "next-auth" {
    interface User {
        id: string;
        email: string;
        name: string;
        image: string;
        role: string;
        accessToken: string;
    }

    // TODO: create next-auth.d.ts
    interface Session {
        accessToken?: string | {};
        user: {
            id: string | {};
            email: string;
            name: string;
            image: string;
            role: string | {};
        };
    }

    interface JWT {
        accessToken?: string;
        id: string;
        email: string;
        name: string;
        picture: string;
        role: string;
    }
}

const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const res = await fetch("https://api.escuelajs.co/api/v1/auth/login", {
                    method: "POST",
                    body: JSON.stringify(credentials),
                    headers: { "Content-Type": "application/json" },
                });
                console.log("API login response status:", res);
                const responseBody = await res.text();
                if (!res.ok) {
                    console.error("API login failed:", responseBody);
                    return null;
                }
                const loginData = JSON.parse(responseBody);
                const accessToken = loginData.access_token;
                if (!accessToken) {
                    console.error("Login API did not return an access token.");
                    return null;
                }

                const profileRes = await fetch("https://api.escuelajs.co/api/v1/auth/profile", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                console.log("Profile API response status:", profileRes);
                const profileResponseBody = await profileRes.text();
                if (!profileRes.ok) {
                    console.error("Profile API failed:", profileResponseBody);
                    return null;
                }
                const profileData: ProfileApiResponse = JSON.parse(profileResponseBody);
                if (profileData && profileData.id) {
                    return {
                        id: String(profileData.id),
                        email: profileData.email,
                        name: profileData.name,
                        image: profileData.avatar,
                        role: profileData.role,
                        accessToken: accessToken,
                    };
                } else {
                    console.error(
                        "Authorize: API returned invalid user data structure or missing token/ID:",
                        profileData
                    );
                    return null;
                }
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.name = user.name;
                token.picture = user.image;
                token.role = user.role;
                token.accessToken = user.accessToken;
            }
            return token;
        },
        async session({ session, token }) {
            if (token.id) session.user.id = token.id;
            if (token.email) session.user.email = token.email;
            if (token.name) session.user.name = token.name;
            if (token.picture) session.user.image = token.picture;
            if (token.role) session.user.role = token.role;
            if (token.accessToken) session.accessToken = token.accessToken;
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET || "my-super-secret-key-that-should-be-in-env",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
