import React from "react";
import { fetchFaq } from "@/services/api";

export const dynamic = 'force-static';

export default async function FaqPage() {
    const faqList = await fetchFaq();

    return (
        <main>
            <h2>FAQ</h2>
            {faqList.map((faq) => (
                <section>
                    <h3>{faq.title}</h3>
                    <p>{faq.content}</p>
                </section>
            ))}
        </main>
    );
}
