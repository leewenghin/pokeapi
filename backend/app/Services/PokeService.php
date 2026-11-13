<?php

namespace App\Services;

use App\Integrations\PokeGatewayClient;
use Illuminate\Support\Facades\Cache;

class PokeService
{
    private PokeGatewayClient $pokeClient;

    public function __construct(PokeGatewayClient $pokeClient)
    {
        $this->pokeClient = $pokeClient;
    }

    public function getPokemons(array $data): array
    {
        $urls = $this->pageUrls($data);

        if ($urls === []) {
            return [];
        }

        return array_map(function (array $pokemon) {
            return [
                'name' => $pokemon['name'],
                'image' => $pokemon['sprites']['other']['official-artwork']['front_default'] ?? null,
                'types' => array_column(array_column($pokemon['types'], 'type'), 'name'),
                'height' => $pokemon['height'],
                'weight' => $pokemon['weight'],
            ];
        }, $this->pokeClient->getPokemonsByUrls($urls));
    }

    private function pageUrls(array $data): array
    {
        $name = strtolower(trim($data['name'] ?? ''));

        if ($name === '') {
            $list = $this->pokeClient->getPokemons([
                'limit' => $data['limit'],
                'offset' => $data['offset'],
            ]);

            return array_column($list['results'] ?? [], 'url');
        }

        $matches = array_values(array_filter(
            $this->pokemonIndex(),
            fn(array $pokemon) => str_contains(strtolower($pokemon['name']), $name),
        ));

        return array_column(array_slice($matches, $data['offset'], $data['limit']), 'url');
    }

    private function pokemonIndex(): array
    {
        return Cache::remember('pokeapi.pokemon-index', 3600, fn() => $this->pokeClient->getPokemonNames());
    }

    public function getPokemon(string $name): array
    {
        $result = $this->pokeClient->getPokemon($name);

        return $result;
    }

    public function getPokemonSpecies(string $name): array
    {
        $result = $this->pokeClient->getPokemonSpecies($name);

        return $result;
    }

    public function getType(string $name): array
    {
        $result = $this->pokeClient->getType($name);

        return $result;
    }

    public function getAbility(string $name): array
    {
        $result = $this->pokeClient->getAbility($name);

        return $result;
    }
}
