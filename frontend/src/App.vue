<script setup lang="ts">
import { ref } from "vue";
import { getLocations, getSingleLocation } from "./api";
import { Locations, Location } from "./modell";

const locations = ref<Locations | null>(null);
const singleLocation = ref<Location | null>(null);
const startGame = ref<boolean>(false);
const error = ref<string | null>(null);

const handleGetLocations = async () => {
  error.value = null;
  const response = await getLocations();
  if (!response.success) {
    error.value = "Failed to fetch locations";
  } else {
    locations.value = response.data;
    startGame.value = true;
  }
};

const handleGetSingleLocation = async (url: string) => {
  error.value = null;
  const response = await getSingleLocation(url);
  if (!response.success) {
    error.value = "Failed to fetch single location";
  } else {
    singleLocation.value = response.data;
  }
};
</script>

<template>
  <div v-if="!startGame && !locations">
    <button @click="handleGetLocations" class="border-2">Start</button>
    <p v-if="error">{{ error }}</p>
  </div>

  <div v-if="startGame && locations && !singleLocation">
    <div v-for="(location, index) in locations?.results" :key="index">
      <p>{{ location.name }}</p>
      <button @click="handleGetSingleLocation(location.url)" class="border-2">
        Choose
      </button>
    </div>
  </div>

  <div
    v-for="(enemy, index) in singleLocation?.pokemon_encounters"
    :key="index"
  >
    <p>{{ enemy.pokemon.name }}</p>
  </div>
</template>

<style scoped></style>
