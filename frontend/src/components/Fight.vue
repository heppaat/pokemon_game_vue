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

const findStats = (statObject: Stats, statName: string) => {
  let statNumber = 0;
  statObject.stats.forEach((element) => {
    if (element.stat.name === statName) {
      statNumber = element.base_stat;
    }
  });
  return statNumber;
};

const fetchStats = async () => {
  fightError.value = null;
  const enemyResponse = await getStats(props.enemyPokemon.url);
  if (!enemyResponse.success) {
    fightError.value = "Failed to fetch enemy stats";
    return;
  } else {
    const enemyStatsRawData = enemyResponse.data;

    const enemyModifiedStats: ModifiedStats = {
      hp: findStats(enemyStatsRawData, "hp"),
      attack: findStats(enemyStatsRawData, "attack"),
      defense: findStats(enemyStatsRawData, "defense"),
    };

    enemyStats.value = enemyModifiedStats;
  }
  fightError.value = null;
  const myResponse = await getStats(props.myChoosenPokemon.url);
  if (!myResponse.success) {
    fightError.value = "Failed to fetch my stats";
    return;
  } else {
    const myStatsRawData = myResponse.data;

    const myModifiedStats: ModifiedStats = {
      hp: findStats(myStatsRawData, "hp"),
      attack: findStats(myStatsRawData, "attack"),
      defense: findStats(myStatsRawData, "defense"),
    };

    myStats.value = myModifiedStats;
  }
};

/* watch(
  () => props.myChoosenPokemon.url,
  (newVal) => {
    if (newVal) {
      fetchStats(newVal);
    }
  },
  { immediate: true }
); */

const changeTurn = () => {
  myTurn.value = !myTurn.value;
};
</script>

<template>
  <main class="flex justify-center gap-10">
    <div>
      <p>{{ props.enemyPokemon.name }}</p>
      <img :src="props.enemyImage" alt="enemyPokemon" />
      <p>Hp:</p>
      <p>Attack:</p>
      <p>Defense:</p>
    </div>
    <div>
      <p>{{ props.myChoosenPokemon.name }}</p>
      <img :src="props.myChoosenPokemon.spriteUrl" alt="myPokemon" />
      <p>Hp:</p>
      <p>Attack:</p>
      <p>Defense:</p>
    </div>
    <p v-if="fightError">{{ fightError }}</p>
  </main>
  <div class="flex justify-center mt-10">
    <button @click="changeTurn" class="border-2">
      {{ myTurn ? "My Turn" : "Enemy's turn" }}
    </button>
  </div>
</template>