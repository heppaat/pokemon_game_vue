import express from "express";
import cors from "cors";
import { load } from "./util/db";
import { MyPokemonSchema } from "./modell";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/myPokemons", async (req, res) => {
  const myPokemons = await load("data", MyPokemonSchema);
  if (!myPokemons) return res.sendStatus(500);

  res.json(myPokemons);
});
