import Navbar from "@/components/navbar/Navbar";
import DashboardPageContent from "@/components/dashboard/DashboardPageContent";

import { fetchFromServer } from "@/utils/fetchFromServer";
import { fetchProductList } from "@/services/api";
import { IProductData } from "@/types/types";

export const revalidate = 30;

export default async function DashboardPage() {
    // Handle fetching product list
    const { productData, errorMessage, isLoading } = await fetchFromServer<
        IProductData[]
    >(fetchProductList);

    return (
        <>
            <h2>Dashboard</h2>
            {/* {isLoading && <p>loading</p>} */}
            <DashboardPageContent
                productDataList={productData}
                errorMessage={errorMessage}
                isLoading={isLoading}
            />
            <Navbar>{""}</Navbar>
        </>
    );
}
