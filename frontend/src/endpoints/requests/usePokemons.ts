import { useInfiniteQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api-client";
import type { PokemonListRequest, PokemonListResponse } from "@/endpoints";

const getPokemons = async ({
    size = "20",
    page = "1",
    name,
}: PokemonListRequest) => {
    const response = await apiRequest<PokemonListResponse>("/pokemons", {
        method: "GET",
        params: {
            offset: page,
            limit: size,
            name: name || undefined,
        },
    });

    return {
        data: response,
    };
};

export function usePokemons(params: Omit<PokemonListRequest, "page">) {
    const size = params.size ?? "20";

    return useInfiniteQuery({
        queryKey: ["pokemons", { size, name: params.name ?? "" }],
        initialPageParam: "1",
        staleTime: 1000 * 60 * 5,
        queryFn: ({ pageParam }) =>
            getPokemons({ size, page: pageParam, name: params.name }),
        getNextPageParam: (lastPage, _pages, lastPageParam) => {
            if (lastPage.data.length < Number(size)) {
                return undefined;
            }

            return String(Number(lastPageParam) + 1);
        },
    });
}