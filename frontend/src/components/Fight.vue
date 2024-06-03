<script setup lang="ts">
import { ref } from "vue";
import { EnemyPokemon, MyPokemon } from "../modell";

const props = defineProps<{
  enemyPokemon: EnemyPokemon;
  enemyImage: string;
  myChoosenPokemon: MyPokemon;
}>();

const myTurn = ref<boolean>(true);

const changeTurn = () => {
  myTurn.value = !myTurn.value;
};
</script>

<template>
  <main class="flex justify-center gap-10">
    <div>
      <p>{{ props.enemyPokemon.name }}</p>
      <img :src="props.enemyImage" alt="enemyPokemon" />
    </div>
    <div>
      <p>{{ props.myChoosenPokemon.name }}</p>
      <img :src="props.myChoosenPokemon.spriteUrl" alt="myPokemon" />
    </div>
  </main>
  <div class="flex justify-center mt-10">
    <button @click="changeTurn" class="border-2">
      {{ myTurn ? "My Turn" : "Enemy's turn" }}
    </button>
  </div>
</template>
