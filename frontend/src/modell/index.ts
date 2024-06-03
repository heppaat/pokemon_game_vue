import { z } from "zod";

export const LocationsSchema = z.object({
  results: z
    .object({
      name: z.string(),
      url: z.string().url(),
    })
    .array(),
});

export type Locations = z.infer<typeof LocationsSchema>;

export const LocationSchema = z.object({
  pokemon_encounters: z
    .object({
      pokemon: z.object({
        name: z.string(),
        url: z.string().url(),
      }),
    })
    .array(),
});

export type Location = z.infer<typeof LocationSchema>;

export const EnemyPokemonSchema = z.object({
  name: z.string(),
  url: z.string().url(),
});

export type EnemyPokemon = z.infer<typeof EnemyPokemonSchema>;

export const MyPokemonsSchema = z
  .object({
    name: z.string(),
    url: z.string().url(),
    spriteUrl: z.string().url(),
  })
  .array();

export type MyPokemons = z.infer<typeof MyPokemonsSchema>;
