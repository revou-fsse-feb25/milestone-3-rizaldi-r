import ErrorDisplay from "./ErrorDisplay";
import LoadingDisplay from "./LoadingDisplay";

export default function ProductList<TProduct extends { id: number }, TActions = void>({
    productDataList,
    ChildrenComponent,
    onEachElementClickedActions,
    isLoading,
    error,
    isGrid = true,
}: {
    productDataList: TProduct[];
    ChildrenComponent: React.ComponentType<{
        productData: TProduct;
        onElementClickedActions?: TActions;
    }>;
    onEachElementClickedActions?: TActions;
    isLoading?: boolean;
    error?: string | null;
    isGrid?: boolean;
}) {
    return (
        <>
            {/* Error display */}
            {error && <ErrorDisplay errorMessage={error} />}

            {/* Loading display */}
            {isLoading && <LoadingDisplay />}

            {/* ProductData display */}
            {!error && !isLoading && (
                <div className={`${isGrid ? "grid" : "flex"} grid-cols-2 gap-3 flex-col w-full`}>
                    {productDataList.length === 0 ? (
                        <p>No products available.</p>
                    ) : (
                        <>
                            {productDataList.map((productData) => (
                                <ChildrenComponent
                                    key={productData.id}
                                    productData={productData}
                                    onElementClickedActions={onEachElementClickedActions}
                                />
                            ))}
                        </>
                    )}
                </div>
            )}
        </>
    );
}