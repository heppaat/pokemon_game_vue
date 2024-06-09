<script setup lang="ts">
import { ref, watch } from "vue";
import {
  EnemyPokemon,
  ModifiedStats,
  MyPokemon,
  MyPokemons,
  Stats,
} from "../modell";
import { addPokemon, getStats } from "../api";

const props = defineProps<{
  enemyPokemon: EnemyPokemon;
  enemyImage: string;
  myChoosenPokemon: MyPokemon;
  backToMainPage: () => void;
  myPokemons: MyPokemons;
}>();

const myTurn = ref<boolean>(true);
const fightError = ref<string | null>(null);
const myStats = ref<ModifiedStats | null>(null);
const enemyStats = ref<ModifiedStats | null>(null);
const counter = ref<number>(1);
const gameEnd = ref<boolean>(false);
const duplicateError = ref<string | null>(null);

const findStats = (statObject: Stats, statName: string) => {
  let statNumber = 0;
  statObject.stats.forEach((element) => {
    if (element.stat.name === statName) {
      statNumber = element.base_stat;
    }
  });
  return statNumber;
};

const fetchStats = async (url: string, target: "my" | "enemy") => {
  fightError.value = null;
  const response = await getStats(url);
  if (!response.success) {
    fightError.value = `Failed to fetch ${
      target === "my" ? "my" : "enemy"
    } stats`;
  } else {
    const statsRawData = response.data;

    const modifedStats: ModifiedStats = {
      hp: findStats(statsRawData, "hp"),
      attack: findStats(statsRawData, "attack"),
      defense: findStats(statsRawData, "defense"),
    };

    if (target === "my") {
      myStats.value = modifedStats;
    } else {
      enemyStats.value = modifedStats;
    }
  }
};

//The damage is calculated using the following formula: ((((2/5+2)*B*60/D)/50)+2)*Z/255, where B is the attacker's Attack, D is defender's Defense, and Z is a random number between 217 and 255.

const damageFormula = (
  attack: number,
  defense: number,
  randomNumber: number
) => {
  const B = attack;
  const D = defense;
  const Z = randomNumber;

  const damage = ((((2 / 5 + 2) * B * 60) / D / 50 + 2) * Z) / 255;
  return damage;
};

const randomNumberGenerator = () => {
  const number = Math.floor(Math.random() * (255 - 217 + 1)) + 217;
  return number;
};

const handleFight = () => {
  if (myTurn.value) {
    if (
      myStats.value?.attack === undefined ||
      enemyStats.value?.defense === undefined
    )
      return;

    const damage = damageFormula(
      myStats.value.attack,
      enemyStats.value.defense,
      randomNumberGenerator()
    );
    const updatedEnemyHP = Math.round(
      Math.max(enemyStats.value.hp - damage, 0)
    );

    enemyStats.value = {
      hp: updatedEnemyHP,
      attack: enemyStats.value.attack,
      defense: enemyStats.value.defense,
    };

    myTurn.value = false;
  } else {
    if (
      enemyStats.value?.attack === undefined ||
      myStats.value?.defense === undefined
    )
      return;
    const damage = damageFormula(
      enemyStats.value.attack,
      myStats.value.defense,
      randomNumberGenerator()
    );

    const updatedMyHp = Math.round(Math.max(myStats.value.hp - damage, 0));

    myStats.value = {
      hp: updatedMyHp,
      attack: myStats.value.attack,
      defense: myStats.value.defense,
    };
    myTurn.value = true;
  }
  counter.value++;
};

watch(
  () => props.myChoosenPokemon.url,
  (newVal) => {
    if (newVal) {
      fetchStats(newVal, "my");
    }
  },
  { immediate: true }
);

watch(
  () => props.enemyPokemon.url,
  (newVal) => {
    if (newVal) {
      fetchStats(newVal, "enemy");
    }
  },
  { immediate: true }
);

//merged the 2 watch functions
/* watch(
  () => [props.myChoosenPokemon.url, props.enemyPokemon.url],
  ([myPokemonUrl, enemyPokemonUrl]) => {
    if (myPokemonUrl) {
      fetchStats(myPokemonUrl, 'my');
    }
    if (enemyPokemonUrl) {
      fetchStats(enemyPokemonUrl, 'enemy');
    }
  },
  { immediate: true }
);
 */
const getIdFromUrl = (url: string) => {
  const id = url.split("/")[6];
  return id;
};

watch(
  () => myStats.value?.hp,
  (newVal) => {
    if (newVal === 0) {
      gameEnd.value = true;
    }
  }
);

watch(
  () => enemyStats.value?.hp,
  (newVal) => {
    if (newVal === 0) {
      gameEnd.value = true;

      if (
        props.myPokemons.some(
          (pokemon) => pokemon.name === props.enemyPokemon.name
        )
      ) {
        duplicateError.value = "This Pokemon is already in your list";
        return;
      }

      addPokemon({
        name: props.enemyPokemon.name,
        url: props.enemyPokemon.url,
        spriteUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getIdFromUrl(
          props.enemyPokemon.url
        )}.png`,
      });
      duplicateError.value = null;
    }
  }
);
</script>

<template>
  <section v-if="!gameEnd" class="h-screen w-screen">
    <div class="flex justify-center my-5">
      <h1 class="font-semibold text-[48px]">YOUR POKEMONS</h1>
    </div>
    <div class="flex flex-wrap justify-evenly">
      <div
        class="flex flex-col items-center bg-[#5B7FD0] rounded-md mb-20 border-2"
      >
        <p
          class="bg-[#B986D7] uppercase font-medium p-4 mt-8 rounded-md border-2"
        >
          {{ props.enemyPokemon.name }}
        </p>
        <img :src="props.enemyImage" alt="enemyPokemon" class="w-[250px]" />
        <p>Hp: {{ enemyStats?.hp }}</p>
        <p>Attack: {{ enemyStats?.attack }}</p>
        <p>Defense: {{ enemyStats?.defense }}</p>
      </div>
      <div
        class="flex flex-col items-center bg-[#5B7FD0] rounded-md mb-20 border-2"
      >
        <p
          class="bg-[#B986D7] uppercase font-medium p-4 mt-8 rounded-md border-2"
        >
          {{ props.myChoosenPokemon.name }}
        </p>
        <img
          :src="props.myChoosenPokemon.spriteUrl"
          alt="myPokemon"
          class="w-[250px]"
        />
        <p>Hp: {{ myStats?.hp }}</p>
        <p>Attack: {{ myStats?.attack }}</p>
        <p>Defense: {{ myStats?.defense }}</p>
      </div>
      <p v-if="fightError">{{ fightError }}</p>
    </div>
    <div class="flex justify-center">
      <button
        @click="handleFight"
        class="py-4 px-8 bg-[#645AA4] text-[white] font-bold rounded-md transition duration-200 hover:bg-[#313167] hover:border-[#313167] border-2 mt-10"
      >
        Round: {{ counter }}
      </button>
    </div>
  </section>

  <section
    v-if="gameEnd && !duplicateError"
    class="h-screen w-screen flex justify-center my-5"
  >
    <div v-if="myStats?.hp === 0">
      <h1 class="font-semibold text-[48px] uppercase text-center">
        You loose!
      </h1>
      <div class="flex justify-center">
        <button
          @click="backToMainPage"
          class="py-4 px-8 bg-[#203FAF] rounded-md text-white font-semibold hover:bg-[#284ed6] hover:scale-105 duration-200 mt-20"
        >
          Start new game
        </button>
      </div>
    </div>

    <div v-else-if="enemyStats?.hp === 0">
      <h1 class="font-semibold text-[48px] uppercase text-center">You win!</h1>
      <h2 class="font-semibold text-[48px] uppercase text-center">
        Pokemon will be added to your own list
      </h2>
      <div class="flex justify-center">
        <button
          @click="backToMainPage"
          class="py-4 px-8 bg-[#203FAF] rounded-md text-white font-semibold hover:bg-[#284ed6] hover:scale-105 duration-200 mt-20"
        >
          Start new game
        </button>
      </div>
    </div>
  </section>

  <section v-else-if="gameEnd && duplicateError" class="h-screen w-screen my-5">
    <h1 class="font-semibold text-[48px] uppercase text-center">You win!</h1>
    <h2 class="font-semibold text-[48px] uppercase text-center">
      However this Pokemon is already in your list
    </h2>
    <div class="flex justify-center">
      <button
        @click="backToMainPage"
        class="py-4 px-8 bg-[#203FAF] rounded-md text-white font-semibold hover:bg-[#284ed6] hover:scale-105 duration-200 mt-20"
      >
        Start new game
      </button>
    </div>
  </section>
</template>
