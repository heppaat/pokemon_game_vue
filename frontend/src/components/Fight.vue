<script setup lang="ts">
import { ref, watch } from "vue";
import { EnemyPokemon, ModifiedStats, MyPokemon, Stats } from "../modell";
import { getStats } from "../api";

const props = defineProps<{
  enemyPokemon: EnemyPokemon;
  enemyImage: string;
  myChoosenPokemon: MyPokemon;
}>();

const myTurn = ref<boolean>(true);
const fightError = ref<string | null>(null);
const myStats = ref<ModifiedStats | null>(null);
const enemyStats = ref<ModifiedStats | null>(null);
const counter = ref<number>(1);
const gameEnd = ref<boolean>(false);

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

watch(
  () => myStats.value?.hp,
  (newVal) => {
    if (newVal === 0) {
      gameEnd.value = true;
    }
  }
);
</script>

<template>
  <main v-if="!gameEnd" class="flex justify-center gap-10">
    <div>
      <p>{{ props.enemyPokemon.name }}</p>
      <img :src="props.enemyImage" alt="enemyPokemon" />
      <p>Hp: {{ enemyStats?.hp }}</p>
      <p>Attack: {{ enemyStats?.attack }}</p>
      <p>Defense: {{ enemyStats?.defense }}</p>
    </div>
    <div>
      <p>{{ props.myChoosenPokemon.name }}</p>
      <img :src="props.myChoosenPokemon.spriteUrl" alt="myPokemon" />
      <p>Hp: {{ myStats?.hp }}</p>
      <p>Attack: {{ myStats?.attack }}</p>
      <p>Defense: {{ myStats?.defense }}</p>
    </div>
    <p v-if="fightError">{{ fightError }}</p>
    <div class="flex">
      <button @click="handleFight" class="border-2">
        Round: {{ counter }}
      </button>
    </div>
  </main>

  <main v-if="gameEnd">
    <div v-if="myStats?.hp === 0">
      <p>You loose!</p>
    </div>
  </main>
</template>
