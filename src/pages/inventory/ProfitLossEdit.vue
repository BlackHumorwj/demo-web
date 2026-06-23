<template>
  <ProfitLossAdd v-if="addRef" ref="addRef" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ProfitLossAdd from './ProfitLossAdd.vue'

const addRef = ref<InstanceType<typeof ProfitLossAdd> | null>(null)
</script>
