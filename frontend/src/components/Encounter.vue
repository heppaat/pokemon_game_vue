<script setup lang="ts">
import { ref, watch } from "vue";
import { getMyPokemons, getSprite } from "../api";
import { EnemyPokemon, MyPokemons, MyPokemon } from "../modell";
import Fight from "./Fight.vue";

const props = defineProps<{
  enemyPokemon: EnemyPokemon;
  back: () => void;
  backToMainPage: () => void;
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
  <section
    v-if="!myPokemons"
    class="h-screen w-screen flex justify-center relative"
  >
    <div class="flex flex-col">
      <div class="flex justify-center my-5">
        <h1 class="font-semibold text-[48px]">YOUR ENEMY</h1>
      </div>
      <div
        class="flex flex-col items-center bg-[#5B7FD0] rounded-md mb-20 border-2"
      >
        <p
          class="bg-[#B986D7] uppercase font-medium p-4 mt-8 rounded-md border-2"
        >
          {{ props.enemyPokemon.name }}
        </p>
        <div v-if="enemyPokemonSprite">
          <img
            :src="enemyPokemonSprite"
            :alt="props.enemyPokemon.name"
            class="w-[250px]"
          />
        </div>
      </div>
      <button
        @click="props.back"
        class="py-4 px-8 bg-[#203FAF] rounded-md text-white font-semibold hover:bg-[#284ed6] hover:scale-105 duration-200"
      >
        Back to locations
      </button>

      <button
        @click="fetchMyPokemons"
        class="py-4 px-8 bg-[#645AA4] text-[white] font-bold rounded-md transition duration-200 hover:bg-[#313167] hover:border-[#313167] border-2 mt-10"
      >
        Choose my Pokemon
      </button>
    </div>
    <div class="absolute flex justify-center p-10">
      <p
        v-if="errorEncounter"
        class="bg-[#B986D7] text-white text-[20px] font-bold p-10 rounded-md border-2"
      >
        {{ errorEncounter }}
      </p>
    </div>
  </section>

  <section
    v-else-if="myPokemons && !myChoosenPokemon"
    class="h-screen w-screen flex justify-center"
  >
    <div class="flex flex-col">
      <div class="flex justify-center my-5">
        <h1 class="font-semibold text-[48px]">YOUR POKEMONS</h1>
      </div>
      <div class="flex flex-wrap gap-6 justify-center px-6">
        <div v-for="(myPokemon, index) in myPokemons" :key="index">
          <div
            class="flex flex-col items-center bg-[#5B7FD0] rounded-md border-2"
          >
            <p
              class="bg-[#B986D7] uppercase font-medium p-4 mt-8 rounded-md border-2"
            >
              {{ myPokemon.name }}
            </p>
            <img :src="myPokemon.spriteUrl" alt="myPokemon" class="w-[250px]" />
          </div>
          <div class="flex justify-center">
            <button
              @click="handleChooseMyPokemon(myPokemon)"
              class="py-4 px-8 bg-[#645AA4] text-[white] font-bold rounded-md transition duration-200 hover:bg-[#313167] hover:border-[#313167] border-2 mt-10 mb-10"
            >
              Choose Me
            </button>
          </div>
        </div>
      </div>
      <div class="flex justify-center">
        <button
          @click="backToEnemy"
          class="py-4 px-8 bg-[#203FAF] rounded-md text-white font-semibold hover:bg-[#284ed6] hover:scale-105 duration-200 mt-10 mb-10"
        >
          Back to enemy
        </button>
      </div>
    </div>
  </section>

  <div v-else-if="myChoosenPokemon">
    <Fight
      :enemyPokemon="enemyPokemon"
      :enemyImage="enemyPokemonSprite!"
      :myChoosenPokemon="myChoosenPokemon"
      :backToMainPage="backToMainPage"
      :myPokemons="myPokemons"
    />
  </div>
</template>

<style scoped></style>
