<script setup lang="ts">
import { ref, watch } from "vue";
import { getLocations, getSingleLocation } from "./api";
import { Locations, Location, EnemyPokemon } from "./modell";
import Encounter from "./components/Encounter.vue";
import pokemon_logo from "./assets/pokemon_logo.png";

const locations = ref<Locations | null>(null);
const singleLocation = ref<Location | null>(null);
const randomEnemyPokemon = ref<EnemyPokemon | null>(null);
const error = ref<string | null>(null);

const handleGetLocations = async () => {
  error.value = null;
  const response = await getLocations();
  if (!response.success) {
    error.value = "Failed to fetch locations";
  } else {
    locations.value = response.data;
  }
};

const handleGetSingleLocation = async (url: string) => {
  error.value = null;
  const response = await getSingleLocation(url);
  if (!response.success) {
    error.value = "Failed to fetch single location";
    return;
  } else {
    singleLocation.value = response.data;
  }
};

const getRandomEnemyPokemon = (array: Location) => {
  const randomIndex = Math.floor(
    Math.random() * array.pokemon_encounters.length
  );

  const enemyPokemon = array.pokemon_encounters[randomIndex];
  randomEnemyPokemon.value = enemyPokemon.pokemon;
};

watch(singleLocation, (newLocation) => {
  if (newLocation) {
    getRandomEnemyPokemon(newLocation);
  }
});

const backToMainPage = () => {
  locations.value = null;
  singleLocation.value = null;
};

const backToLocations = () => {
  singleLocation.value = null;
};
</script>

<template>
  <section
    v-if="!locations"
    class="h-screen w-screen flex justify-center items-center relative"
  >
    <div class="flex flex-col justify-center items-center p-10">
      <img :src="pokemon_logo" alt="pokemon_main_logo" class="w-auto h-auto" />

      <div class="flex flex-col justify-center items-center">
        <button
          @click="handleGetLocations"
          class="py-4 px-8 bg-[#645AA4] text-[white] font-bold rounded-md transition duration-200 hover:bg-[#313167] hover:border-[#313167] border-2 mt-10"
        >
          Start
        </button>
      </div>
    </div>
    <div class="absolute flex justify-center items-center p-10">
      <p
        v-if="error"
        class="bg-[#B986D7] text-white text-[20px] font-bold p-10 rounded-md"
      >
        {{ error }}
      </p>
    </div>
  </section>

  <div v-else-if="locations && !singleLocation">
    <div v-for="(location, index) in locations?.results" :key="index">
      <p>{{ location.name }}</p>
      <button @click="handleGetSingleLocation(location.url)" class="border-2">
        Choose
      </button>
    </div>
    <button @click="backToMainPage" class="border-2">Back to start page</button>
    <p v-if="error">{{ error }}</p>
  </div>

  <div v-else-if="singleLocation">
    <Encounter
      :enemyPokemon="randomEnemyPokemon!"
      :errorMessage="error"
      :back="backToLocations"
      :backToMainPage="backToMainPage"
    />
  </div>
</template>

<style scoped></style>
