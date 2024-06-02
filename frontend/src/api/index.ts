import { safeFetch } from "../lib/http";
import { LocationsSchema, LocationSchema } from "../modell";

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
