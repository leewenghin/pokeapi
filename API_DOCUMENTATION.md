# API documentation

Base URL: `http://127.0.0.1:8000/api`

The backend loads Pokémon from PokeAPI and returns the fields below. The browser should call this API, not PokeAPI.

## GET /pokemons

Paged list of Pokémon cards.

### Query parameters

| Name | Required | Rules | Meaning |
| --- | --- | --- | --- |
| `offset` | yes | integer, minimum 1 | Page number. Page 1 is the first page. |
| `limit` | yes | integer, minimum 1 | Cards per page. |
| `name` | no | string, maximum 50 characters | Case-insensitive name filter. |

`offset` is a page number. The server turns it into a PokeAPI offset with `(offset - 1) * limit`.

When `name` is empty, the page is the normal Pokédex order. When `name` is set, the server filters the first 2,000 names, then pages those matches. A match is any name that contains the text, so `pika` includes `pikachu` and `pikachu-gmax`. That name list is cached for one hour.

### Example

`GET /api/pokemons?offset=1&limit=2`

```json
[
  {
    "name": "bulbasaur",
    "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
    "types": ["grass", "poison"],
    "height": 7,
    "weight": 69
  },
  {
    "name": "ivysaur",
    "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/2.png",
    "types": ["grass", "poison"],
    "height": 10,
    "weight": 130
  }
]
```

The body is a JSON array. `height` is in decimetres and `weight` is in hectograms, which is how PokeAPI reports them. `image` is the official artwork, or `null` when that sprite is missing.

`GET /api/pokemons?offset=2&limit=1&name=saur` returns the second name that contains `saur`.

An empty page is `[]`.

### Errors

A missing or invalid query returns `422`:

```json
{
  "message": "The offset field is required. (and 1 more error)",
  "errors": {
    "offset": ["The offset field is required."],
    "limit": ["The limit field is required."]
  }
}
```

## GET /pokemon/{name}

One Pokémon card. `{name}` is the PokeAPI name, such as `ivysaur`.

### Example

`GET /api/pokemon/ivysaur`

```json
{
  "name": "ivysaur",
  "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/2.png",
  "types": ["grass", "poison"],
  "height": 10,
  "weight": 130
}
```

`types` is a list of type names. An unknown name returns `404`.

## GET /pokemon-species/{name}

Species record for a Pokémon. `{name}` is the species name, such as `aegislash`.

`GET /api/pokemon-species/aegislash`

The response below is shortened. `names`, `flavor_text_entries`, `genera`, `pokedex_numbers`, and `varieties` continue for every language, game, and form.

```json
{
  "id": 681,
  "name": "aegislash",
  "order": 682,
  "gender_rate": 4,
  "capture_rate": 45,
  "base_happiness": 70,
  "is_baby": false,
  "is_legendary": false,
  "is_mythical": false,
  "hatch_counter": 20,
  "has_gender_differences": false,
  "forms_switchable": true,
  "growth_rate": {
    "name": "medium",
    "url": "https://pokeapi.co/api/v2/growth-rate/2/"
  },
  "egg_groups": [
    {
      "name": "mineral",
      "url": "https://pokeapi.co/api/v2/egg-group/10/"
    }
  ],
  "color": {
    "name": "brown",
    "url": "https://pokeapi.co/api/v2/pokemon-color/3/"
  },
  "shape": {
    "name": "blob",
    "url": "https://pokeapi.co/api/v2/pokemon-shape/5/"
  },
  "evolves_from_species": {
    "name": "doublade",
    "url": "https://pokeapi.co/api/v2/pokemon-species/680/"
  },
  "evolution_chain": {
    "url": "https://pokeapi.co/api/v2/evolution-chain/349/"
  },
  "habitat": null,
  "generation": {
    "name": "generation-vi",
    "url": "https://pokeapi.co/api/v2/generation/6/"
  },
  "names": [
    {
      "name": "Aegislash",
      "language": {
        "name": "en",
        "url": "https://pokeapi.co/api/v2/language/9/"
      }
    }
  ],
  "flavor_text_entries": [
    {
      "flavor_text": "Generations of kings were attended by these\nPokémon, which used their spectral power to\nmanipulate and control people and Pokémon.",
      "language": {
        "name": "en",
        "url": "https://pokeapi.co/api/v2/language/9/"
      },
      "version": {
        "name": "x",
        "url": "https://pokeapi.co/api/v2/version/23/"
      }
    }
  ],
  "genera": [
    {
      "genus": "Royal Sword Pokémon",
      "language": {
        "name": "en",
        "url": "https://pokeapi.co/api/v2/language/9/"
      }
    }
  ],
  "varieties": [
    {
      "is_default": true,
      "pokemon": {
        "name": "aegislash-shield",
        "url": "https://pokeapi.co/api/v2/pokemon/681/"
      }
    },
    {
      "is_default": false,
      "pokemon": {
        "name": "aegislash-blade",
        "url": "https://pokeapi.co/api/v2/pokemon/10026/"
      }
    }
  ]
}
```

`habitat` is `null` when the species has no habitat. `evolves_from_species` is `null` when the species does not evolve from another. An unknown name returns `404`.

## GET /type/{name}

Damage relationships, moves, and the Pokémon of this type. `{name}` is a type name, such as `flying`.

`GET /api/type/flying`

The response below is shortened. `pokemon`, `moves`, `names`, and `sprites` continue for the full type.

```json
{
  "id": 3,
  "name": "flying",
  "damage_relations": {
    "no_damage_to": [],
    "half_damage_to": [
      { "name": "rock", "url": "https://pokeapi.co/api/v2/type/6/" },
      { "name": "steel", "url": "https://pokeapi.co/api/v2/type/9/" },
      { "name": "electric", "url": "https://pokeapi.co/api/v2/type/13/" }
    ],
    "double_damage_to": [
      { "name": "fighting", "url": "https://pokeapi.co/api/v2/type/2/" },
      { "name": "bug", "url": "https://pokeapi.co/api/v2/type/7/" },
      { "name": "grass", "url": "https://pokeapi.co/api/v2/type/12/" }
    ],
    "no_damage_from": [
      { "name": "ground", "url": "https://pokeapi.co/api/v2/type/5/" }
    ],
    "half_damage_from": [
      { "name": "fighting", "url": "https://pokeapi.co/api/v2/type/2/" },
      { "name": "bug", "url": "https://pokeapi.co/api/v2/type/7/" },
      { "name": "grass", "url": "https://pokeapi.co/api/v2/type/12/" }
    ],
    "double_damage_from": [
      { "name": "rock", "url": "https://pokeapi.co/api/v2/type/6/" },
      { "name": "electric", "url": "https://pokeapi.co/api/v2/type/13/" },
      { "name": "ice", "url": "https://pokeapi.co/api/v2/type/15/" }
    ]
  },
  "generation": {
    "name": "generation-i",
    "url": "https://pokeapi.co/api/v2/generation/1/"
  },
  "move_damage_class": {
    "name": "physical",
    "url": "https://pokeapi.co/api/v2/move-damage-class/2/"
  },
  "names": [
    {
      "name": "Flying",
      "language": {
        "name": "en",
        "url": "https://pokeapi.co/api/v2/language/9/"
      }
    }
  ],
  "pokemon": [
    {
      "slot": 2,
      "pokemon": {
        "name": "charizard",
        "url": "https://pokeapi.co/api/v2/pokemon/6/"
      }
    }
  ],
  "moves": [
    {
      "name": "gust",
      "url": "https://pokeapi.co/api/v2/move/16/"
    }
  ]
}
```

`slot` is `1` when Flying is the Pokémon's first type and `2` when it is the second. An unknown name returns `404`.

## GET /ability/{name}

Effect text and the Pokémon that can have this ability. `{name}` is an ability name, such as `battle-armor`.

`GET /api/ability/battle-armor`

The response below is shortened. `names`, `effect_entries`, `flavor_text_entries`, and `pokemon` continue for every language and Pokémon.

```json
{
  "id": 4,
  "name": "battle-armor",
  "is_main_series": true,
  "generation": {
    "name": "generation-iii",
    "url": "https://pokeapi.co/api/v2/generation/3/"
  },
  "names": [
    {
      "name": "Battle Armor",
      "language": {
        "name": "en",
        "url": "https://pokeapi.co/api/v2/language/9/"
      }
    }
  ],
  "effect_entries": [
    {
      "effect": "Moves cannot score critical hits against this Pokémon.\n\nThis ability functions identically to Shell Armor.",
      "short_effect": "Protects against critical hits.",
      "language": {
        "name": "en",
        "url": "https://pokeapi.co/api/v2/language/9/"
      }
    }
  ],
  "flavor_text_entries": [
    {
      "flavor_text": "Blocks critical hits.",
      "language": {
        "name": "en",
        "url": "https://pokeapi.co/api/v2/language/9/"
      },
      "version_group": {
        "name": "ruby-sapphire",
        "url": "https://pokeapi.co/api/v2/version-group/5/"
      }
    }
  ],
  "pokemon": [
    {
      "is_hidden": true,
      "slot": 3,
      "pokemon": {
        "name": "cubone",
        "url": "https://pokeapi.co/api/v2/pokemon/104/"
      }
    }
  ]
}
```

`is_hidden` is `true` when the ability is a hidden ability for that Pokémon. An unknown name returns `404`.
