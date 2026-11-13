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

`types` is a list of type names. An unknown name returns the upstream error from PokeAPI, usually `404`.

## GET /type/{name}

Proxies the PokeAPI type resource. The response is the PokeAPI JSON for that type.

`GET /api/type/grass`

## GET /ability/{name}

Proxies the PokeAPI ability resource. The response is the PokeAPI JSON for that ability.

`GET /api/ability/overgrow`
