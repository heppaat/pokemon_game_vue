import { safeFetch } from "../lib/http";
import {
  LocationsSchema,
  LocationSchema,
  MyPokemonsSchema,
  StatsSchema,
} from "../modell";

export const getLocations = async () => {
  return safeFetch({
    method: "GET",
    url: "https://pokeapi.co/api/v2/location-area/",
    schema: LocationsSchema,
  });
};

export const getSingleLocation = async (url: string) =>
  safeFetch({
    method: "GET",
    url: url,
    schema: LocationSchema,
  });

export const getSprite = async (id: string) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

export const getMyPokemons = async () =>
  safeFetch({
    method: "GET",
    url: "http://localhost:3000/api/myPokemons/",
    schema: MyPokemonsSchema,
  });

export const getStats = async (url: string) =>
  safeFetch({
    method: "GET",
    url: url,
    schema: StatsSchema,
  });
