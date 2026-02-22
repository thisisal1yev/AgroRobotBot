<script setup lang="ts">
const { title } = defineProps<{
  title: string;
}>();

const open = defineModel<boolean>("open", { default: false });
</script>

<template>
  <USlideover v-model:open="open" :title="title">
    <template #body>
      <slot />
    </template>
  </USlideover>
</template>
