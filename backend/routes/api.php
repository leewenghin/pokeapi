<?php

use App\Http\Controllers\api\PokemonController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Route::prefix('v1')->group(function () {
Route::controller(PokemonController::class)->group(function () {
    Route::get('/pokemons', 'getPokemons');
    Route::get('/pokemon/{name}', 'getPokemon');
    Route::get('/type/{name}', 'getType');
    Route::get('/ability/{name}', 'getAbility');
});
// });
