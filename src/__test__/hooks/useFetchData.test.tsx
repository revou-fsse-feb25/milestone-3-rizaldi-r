import { renderHook, waitFor } from '@testing-library/react';
import { useFetchData } from '@/hooks/useFetchData';

describe('useFetchData', () => {
    let mockFetcher: jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
        mockFetcher = jest.fn();
    });

    it('should return initial loading state as true', () => {
        mockFetcher.mockReturnValueOnce(new Promise(() => {})); // Never resolves

        const { result } = renderHook(() => useFetchData(mockFetcher, 'param1'));

        expect(result.current.isLoading).toBe(true);
        expect(result.current.data).toEqual([]); 
        expect(result.current.error).toBeNull(); 
    });

    it('should fetch data successfully and update state', async () => {
        const mockData = [{ id: 1, name: 'Test Product' }];
        mockFetcher.mockResolvedValueOnce(mockData); 

        const { result } = renderHook(() => useFetchData(mockFetcher, 'param1'));

        expect(result.current.isLoading).toBe(true);

        // Wait for the data to be fetched and state to update
        await waitFor(() => {
            expect(result.current.isLoading).toBe(false); 
            expect(result.current.data).toEqual(mockData);
            expect(result.current.error).toBeNull();
        });

        // Ensure the fetcher was called with the correct parameters
        expect(mockFetcher).toHaveBeenCalledTimes(1);
        expect(mockFetcher).toHaveBeenCalledWith('param1');
    });

    it('should handle API errors and update error state', async () => {
        const errorMessage = 'Failed to fetch data from API';
        mockFetcher.mockRejectedValueOnce(new Error(errorMessage));

        const { result } = renderHook(() => useFetchData(mockFetcher, 'param1'));

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(result.current.data).toEqual([]);
            expect(result.current.error).toBe(errorMessage); 
        });

        expect(mockFetcher).toHaveBeenCalledTimes(1);
    });

    it('should handle unknown errors and set a generic error message', async () => {
        mockFetcher.mockRejectedValueOnce('Something went wrong!');

        const { result } = renderHook(() => useFetchData(mockFetcher, 'param1'));

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(result.current.data).toEqual([]);
            expect(result.current.error).toBe("An unknown error occurred."); // Generic error message
        });

        expect(mockFetcher).toHaveBeenCalledTimes(1);
    });

    it('should re-fetch data when refetch is called', async () => {
        const initialData = [{ id: 1, name: 'Initial Data' }];
        const refetchedData = [{ id: 2, name: 'Refetched Data' }];

        mockFetcher.mockResolvedValueOnce(initialData);

        const { result } = renderHook(() => useFetchData(mockFetcher, 'param1'));

        // Wait for the initial data fetch to complete
        await waitFor(() => {
            expect(result.current.data).toEqual(initialData);
            expect(result.current.isLoading).toBe(false);
        });

        // Prepare a deferred promise for the refetch, so we can control its resolution
        let resolveRefetchPromise: (value: any) => void = jest.fn();
        const refetchPromise = new Promise(resolve => {
            resolveRefetchPromise = resolve;
        });
        mockFetcher.mockReturnValueOnce(refetchPromise);

        // Call the refetch function
        result.current.refetch('param2');

        // Expect loading to be true immediately after refetch is called, as the promise is still pending
        await waitFor(() => expect(result.current.isLoading).toBe(true), { timeout: 100 });

        // Resolve the refetch promise with the new data
        resolveRefetchPromise(refetchedData);

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(result.current.data).toEqual(refetchedData);
        });

        expect(mockFetcher).toHaveBeenCalledTimes(2);
        expect(mockFetcher).toHaveBeenCalledWith('param1');
        expect(mockFetcher).toHaveBeenCalledWith('param2');
    });

    it('should re-fetch data when fetcherParams change', async () => {
        const dataForParam1 = [{ id: 1, val: 'Data A' }];
        const dataForParam2 = [{ id: 2, val: 'Data B' }];

        mockFetcher.mockResolvedValueOnce(dataForParam1);

        const { result, rerender } = renderHook(({ param }) => useFetchData(mockFetcher, param), {
            initialProps: { param: 'param1' },
        });

        await waitFor(() => {
            expect(result.current.data).toEqual(dataForParam1);
        });

        // Change the fetcherParams and rerender the hook
        mockFetcher.mockResolvedValueOnce(dataForParam2);

        rerender({ param: 'param2' });

        await waitFor(() => expect(result.current.isLoading).toBe(true), { timeout: 100 });

        await waitFor(() => {
            expect(result.current.data).toEqual(dataForParam2);
            expect(result.current.isLoading).toBe(false);
        });

        expect(mockFetcher).toHaveBeenCalledTimes(2);
        expect(mockFetcher).toHaveBeenCalledWith('param1');
        expect(mockFetcher).toHaveBeenCalledWith('param2');
    });
});
