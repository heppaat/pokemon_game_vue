<script setup lang="ts">
import { ref, watch } from "vue";
import { getMyPokemons, getSprite } from "../api";
import { EnemyPokemon, MyPokemons, MyPokemon } from "../modell";
import Fight from "./Fight.vue";

const props = defineProps<{
  enemyPokemon: EnemyPokemon;
  errorMessage: string | null;
  back: () => void;
}>();

const enemyPokemonSprite = ref<string | null>(null);
const errorEncounter = ref<string | null>(null);
const myPokemons = ref<MyPokemons | null>(null);
const myChoosenPokemon = ref<MyPokemon | null>(null);

const getIdFromUrl = (url: string) => {
  const id = url.split("/")[6];
  return id;
};

const fetchImageOfEnemyPokemon = async (url: string) => {
  try {
    const sprite = await getSprite(getIdFromUrl(url));
    enemyPokemonSprite.value = sprite;
  } catch (error) {
    console.error("Failed to get image", error);
  }
};

const fetchMyPokemons = async () => {
  errorEncounter.value = null;
  const response = await getMyPokemons();
  if (!response.success) {
    errorEncounter.value = "Failed to fetch My Pokemons";
    return;
  } else {
    myPokemons.value = response.data;
  }
};

const handleChooseMyPokemon = (myPokemon: MyPokemon) => {
  myChoosenPokemon.value = myPokemon;
};

const backToEnemy = () => {
  myPokemons.value = null;
};

watch(
  () => props.enemyPokemon.url,
  (newUrl) => {
    if (newUrl) {
      fetchImageOfEnemyPokemon(newUrl);
    }
  },
  { immediate: true }
);
</script>

<template>
  <div v-if="!myPokemons">
    <p>{{ props.enemyPokemon.name }}</p>
    <div v-if="enemyPokemonSprite">
      <img :src="enemyPokemonSprite" :alt="props.enemyPokemon.name" />
    </div>
    <button @click="props.back" class="border-2">Back to locations</button>
    <p v-if="props.errorMessage">{{ props.errorMessage }}</p>

    <button @click="fetchMyPokemons" class="border-2">Choose my Pokemon</button>
    <p v-if="errorEncounter">{{ errorEncounter }}</p>
  </div>

  <div v-else-if="myPokemons && !myChoosenPokemon">
    <div v-for="(myPokemon, index) in myPokemons" :key="index">
      <p>{{ myPokemon.name }}</p>
      <img :src="myPokemon.spriteUrl" alt="myPokemon" />
      <button @click="handleChooseMyPokemon(myPokemon)" class="border-2">
        Choose Me
      </button>
    </div>
    <button @click="backToEnemy" class="border-2">Back to enemy</button>
  </div>

  <div v-else-if="myChoosenPokemon">
    <Fight
      :enemyPokemon="enemyPokemon"
      :enemyImage="enemyPokemonSprite!"
      :myChoosenPokemon="myChoosenPokemon"
    />
  </div>
</template>

<style scoped></style>
