import Navbar from "@/components/Navbar";
import DashboardPageContent from "@/components/DashboardPageContent";

export const revalidate = 30;

export default async function DashboardPage() {
    return (
        <>
            <h2>Dashboard</h2>
            <DashboardPageContent />
            <Navbar>{""}</Navbar>
        </>
    );
}
