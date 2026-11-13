export interface PokemonListRequest {
    size?: string;
    page: string;
    name?: string;
}

export interface Pokemon {
    name: string;
    image: string | null;
    types: string[];
    height: number;
    weight: number;
}

export type PokemonListResponse = Pokemon[];

