<script setup lang="ts">
import { EnemyPokemon } from "../modell";

defineProps<{
  enemyPokemon: EnemyPokemon;
  errorMessage: string | null;
  back: () => void;
}>();
</script>

<template>
  <div>
    <p>{{ enemyPokemon.pokemon.name }}</p>
  </div>
  <button @click="back" class="border-2">Back to locations</button>
  <p v-if="errorMessage">{{ errorMessage }}</p>
</template>

<style scoped></style>
