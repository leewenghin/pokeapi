"use client";

import { SubmitEvent, useState } from "react";
import Image from "next/image";
import { usePokemons } from "@/endpoints";

function SearchForm({ onSearch }: { onSearch: (name: string) => void }) {
  const [localInput, setLocalInput] = useState("");

  function search(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    onSearch(localInput.trim());
  }

  return (
    <form
      onSubmit={search}
      className="sticky top-5 z-20 mb-4 flex gap-2 bg-zinc-50"
    >
      <input
        type="text"
        value={localInput}
        onChange={(event) => setLocalInput(event.target.value)}
        className="min-w-0 flex-1 rounded-md border border-gray-300 px-3 py-2 text-gray-700"
        placeholder="Search Pokemon..."
      />
      <button
        type="submit"
        className="rounded-md bg-orange-400 px-4 py-2 text-white cursor-pointer"
      >
        Search
      </button>
    </form>
  );
}

export default function Home() {
  const [name, setName] = useState("");
  const pokemons = usePokemons({ size: "20", name });
  const cards = pokemons.data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <main className="flex min-h-screen flex-col gap-5 bg-zinc-50 p-5 font-sans">
      <section className="flex shrink-0 gap-3">
        <div className="relative aspect-30/7 min-w-0 flex-1 overflow-hidden rounded-lg">
          <Image
            src="/images/carousel.png"
            alt=""
            fill
            priority
            className="object-cover"
          />
        </div>
        <div className="flex w-75 shrink-0 flex-col gap-3">
          <div className="relative min-h-32 flex-1 overflow-hidden rounded-lg">
            <Image
              src="/images/banner.png"
              alt=""
              fill
              sizes="300px"
              className="object-cover"
            />
          </div>
          <div className="relative min-h-32 flex-1 overflow-hidden rounded-lg">
            <Image
              src="/images/banner.png"
              alt=""
              fill
              sizes="300px"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="flex w-full flex-col gap-5 lg:flex-row lg:items-start">
        <div className="h-40 w-full shrink-0 lg:sticky lg:top-5 lg:h-[calc(100dvh-2.5rem)] lg:w-75">
          <div className="relative h-full overflow-hidden rounded-lg">
            <Image
              src="/images/side.png"
              alt=""
              fill
              sizes="(min-width: 1024px) 300px, 100vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <SearchForm onSearch={setName} />

          <div>
            {pokemons.isPending ? (
              <p className="text-gray-500">Loading Pokémon...</p>
            ) : null}
            {pokemons.isError ? (
              <p className="text-gray-500">Couldn&apos;t load Pokémon.</p>
            ) : null}
            {!pokemons.isPending && !pokemons.isError && cards.length === 0 ? (
              <p className="text-gray-500">No Pokémon found.</p>
            ) : null}

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {cards.map((pokemon) => (
                <div
                  key={pokemon.name}
                  className="flex gap-3 rounded-lg bg-white p-4 shadow-sm"
                >
                  {pokemon.image ? (
                    <Image
                      src={pokemon.image}
                      alt={pokemon.name}
                      width={64}
                      height={64}
                      sizes="64px"
                      className="size-16 object-contain"
                      loading="eager"
                    />
                  ) : null}
                  <div className="min-w-0">
                    <div className="text-black capitalize">{pokemon.name}</div>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {pokemon.types.map((type) => (
                        <span
                          key={type}
                          className="rounded bg-gray-200 px-2 py-0.5 text-sm text-gray-500 capitalize"
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {pokemons.hasNextPage ? (
              <button
                type="button"
                onClick={() => pokemons.fetchNextPage()}
                disabled={pokemons.isFetchingNextPage}
                className="mt-4 w-full rounded-md bg-orange-400 px-4 py-2 text-white disabled:opacity-60 cursor-pointer"
              >
                {pokemons.isFetchingNextPage ? "Loading..." : "Load More"}
              </button>
            ) : null}
          </div>
        </div>

        <div className="h-40 w-full shrink-0 lg:sticky lg:top-5 lg:h-[calc(100dvh-2.5rem)] lg:w-75">
          <div className="relative h-full overflow-hidden rounded-lg">
            <Image
              src="/images/side.png"
              alt=""
              fill
              sizes="(min-width: 1024px) 300px, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
