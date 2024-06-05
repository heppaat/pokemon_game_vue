import express from "express";
import cors from "cors";
import { load, save } from "./util/db";
import { MyPokemonSchema } from "./modell";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/myPokemons", async (req, res) => {
  const myPokemons = await load("data", MyPokemonSchema.array());
  if (!myPokemons) return res.sendStatus(500);

  res.json(myPokemons);
});

app.post("/api/myPokemons", async (req, res) => {
  const result = MyPokemonSchema.safeParse(req.body);
  if (!result.success) return res.sendStatus(400);
  const newPokemon = result.data;

  const myPokemons = await load("data", MyPokemonSchema.array());
  if (!myPokemons) return res.sendStatus(500);

  if (myPokemons.some((pokemon) => pokemon.name === newPokemon.name)) {
    return res.status(400).json({ error: "Duplicate Pokemon" });
  }

  const isSuccessfull = await save(
    "data",
    [...myPokemons, newPokemon],
    MyPokemonSchema.array()
  );

  if (!isSuccessfull) return res.sendStatus(500);

  res.sendStatus(200);
});

app.listen(3000);
