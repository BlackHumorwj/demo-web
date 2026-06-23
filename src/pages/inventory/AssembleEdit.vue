<template>
  <AssembleAdd v-if="addRef" ref="addRef" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AssembleAdd from './AssembleAdd.vue'

const addRef = ref<InstanceType<typeof AssembleAdd> | null>(null)
</script>
