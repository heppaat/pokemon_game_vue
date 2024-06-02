<script setup lang="ts">
import { ref, watch } from "vue";
import { getSprite } from "../api";
import { EnemyPokemon } from "../modell";

const props = defineProps<{
  enemyPokemon: EnemyPokemon;
  errorMessage: string | null;
  back: () => void;
}>();

const enemyPokemonSprite = ref<string | null>(null);

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
  <div>
    <p>{{ props.enemyPokemon.name }}</p>
    <div v-if="enemyPokemonSprite">
      <img :src="enemyPokemonSprite" :alt="props.enemyPokemon.name" />
    </div>
  </div>
  <button @click="props.back" class="border-2">Back to locations</button>
  <p v-if="props.errorMessage">{{ props.errorMessage }}</p>
</template>

<style scoped></style>
