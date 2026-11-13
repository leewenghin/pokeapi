<?php

namespace App\Integrations;

use Illuminate\Http\Client\Pool;
use Illuminate\Support\Facades\Http;
use Throwable;

class PokeGatewayClient
{
    public function getPokemons(array $payload)
    {
        $response = Http::baseUrl(config('services.pokeapi.url'))
            ->acceptJson()
            ->timeout(10)
            ->get('/pokemon', $payload);

        $response->throw();

        return $response->json();
    }

    public function getPokemonNames(): array
    {
        $response = Http::baseUrl(config('services.pokeapi.url'))
            ->acceptJson()
            ->timeout(10)
            ->get('/pokemon', ['limit' => 2000, 'offset' => 0]);

        $response->throw();

        return $response->json('results') ?? [];
    }

    public function getPokemonsByUrls(array $urls): array
    {
        $responses = Http::pool(function (Pool $pool) use ($urls) {
            foreach ($urls as $url) {
                $pool->acceptJson()->timeout(10)->get($url);
            }
        });

        ksort($responses);

        return array_values(array_map(function ($response) {
            if ($response instanceof Throwable) {
                throw $response;
            }

            $response->throw();

            return $response->json();
        }, $responses));
    }

    public function getPokemon(string $name)
    {
        $response = Http::baseUrl(config('services.pokeapi.url'))
            ->acceptJson()
            ->timeout(10)
            ->get("/pokemon/{$name}");

        $response->throw();

        return $response->json();
    }

    public function getPokemonSpecies(string $name)
    {
        $response = Http::baseUrl(config('services.pokeapi.url'))
            ->acceptJson()
            ->timeout(10)
            ->get("/pokemon-species/{$name}");

        $response->throw();

        return $response->json();
    }

    public function getType(string $name)
    {
        $response = Http::baseUrl(config('services.pokeapi.url'))
            ->acceptJson()
            ->timeout(10)
            ->get("/type/{$name}");

        $response->throw();

        return $response->json();
    }

    public function getAbility(string $name)
    {
        $response = Http::baseUrl(config('services.pokeapi.url'))
            ->acceptJson()
            ->timeout(10)
            ->get("/ability/{$name}");

        $response->throw();

        return $response->json();
    }
}
