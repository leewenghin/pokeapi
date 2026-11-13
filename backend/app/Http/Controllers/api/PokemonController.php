<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Services\PokeService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PokemonController extends Controller
{
    public function getPokemons(Request $request, PokeService $pokeService)
    {
        $validated = $request->validate([
            'offset' => ['required', 'integer', 'min:1'],
            'limit' => ['required', 'integer', 'min:1'],
            'name' => ['nullable', 'string', 'max:50'],
        ]);

        $limit = (int) $validated['limit'];

        $results = $pokeService->getPokemons([
            'limit' => $limit,
            'offset' => ((int) $validated['offset'] - 1) * $limit,
            'name' => $validated['name'] ?? '',
        ]);

        return $results;
    }

    public function getPokemon(string $name, PokeService $pokeService)
    {
        $validated = Validator::make(['name' => $name], ['name' => ['required', 'string']])->validate();

        $results = $pokeService->getPokemon($validated['name']);

        $types = collect($results['types'])->pluck('type.name');

        return [
            'name' => $results['name'],
            'image' => $results['sprites']['other']['official-artwork']['front_default'] ?? null,
            'types' => $types,
            'height' => $results['height'],
            'weight' => $results['weight'],
        ];
    }

    public function getPokemonSpecies(string $name, PokeService $pokeService)
    {
        $validated = Validator::make(['name' => $name], ['name' => ['required', 'string']])->validate();

        $results = $pokeService->getPokemon($validated['name']);

        return $results;
    }

    public function getType(string $name, PokeService $pokeService)
    {
        $validated = Validator::make(['name' => $name], ['name' => ['required', 'string']])->validate();

        $results = $pokeService->getType($validated['name']);

        return $results;
    }

    public function getAbility(string $name, PokeService $pokeService)
    {
        $validated = Validator::make(['name' => $name], ['name' => ['required', 'string']])->validate();

        $results = $pokeService->getAbility($validated['name']);

        return $results;
    }
}
