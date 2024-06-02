<script setup lang="ts">
import { ref, watch } from "vue";
import { getLocations, getSingleLocation } from "./api";
import { Locations, Location, EnemyPokemon } from "./modell";
import Encounter from "./components/Encounter.vue";

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
  } else {
    singleLocation.value = response.data;
    console.log(singleLocation.value.pokemon_encounters);
  }
};

const getRandomEnemyPokemon = (array: Location) => {
  const randomIndex = Math.floor(
    Math.random() * array.pokemon_encounters.length
  );

  randomEnemyPokemon.value = array.pokemon_encounters[randomIndex];
};

watch(singleLocation, (newLocation) => {
  if (newLocation) {
    getRandomEnemyPokemon(newLocation);
  }
});

const backToMainPage = () => {
  locations.value = null;
};

const backToLocations = () => {
  singleLocation.value = null;
};
</script>

<template>
  <div v-if="!locations">
    <button @click="handleGetLocations" class="border-2">Start</button>
    <p v-if="error">{{ error }}</p>
  </div>

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
    />
  </div>
</template>

<style scoped></style>
