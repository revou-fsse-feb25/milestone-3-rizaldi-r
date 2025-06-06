type FetcherFunction<TData, TParams extends any[]> = (...params: TParams) => Promise<TData>;

async function initialFetch<TData, TParams extends any[] = any[]>(
    fetcher: FetcherFunction<TData, TParams>,
    ...fetcherParams: TParams
): Promise<TData> {
    try {
        return await fetcher(...fetcherParams);
    } catch (error) {
        console.error("Server-side fetch error:", error);
        throw error;
    }
}

export async function fetchFromServer<TData, TParams extends any[] = any[]>(
    fetcher: FetcherFunction<TData, TParams>,
    ...fetcherParams: TParams
) {
    // TODO: fix the any
    let productData: TData | any = null;
    let errorMessage: string = "";
    let isLoading: boolean = true

    const fetchData = async () => {
        try {
            productData = await initialFetch<TData, TParams>(fetcher, ...fetcherParams);
            return productData;
        } catch (error: unknown) {
            errorMessage = (error as Error).message;
            return errorMessage;
        } finally {
            isLoading = false
            return isLoading
        }
    };

    await fetchData();

    return {
        productData,
        errorMessage,
        isLoading,
        refetch: fetchData,
    };
}
