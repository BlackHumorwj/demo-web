<template>
  <CostAdjustAdd v-if="addRef" ref="addRef" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CostAdjustAdd from './CostAdjustAdd.vue'

const addRef = ref<InstanceType<typeof CostAdjustAdd> | null>(null)
</script>
