<script setup lang="ts">
const { title } = defineProps<{
  title: string;
}>();

const open = defineModel<boolean>("open", { default: false });
</script>

<template>
  <USlideover v-model:open="open">
    <template #header>
      <h3 class="text-lg font-semibold">
        {{ title }}
      </h3>
    </template>

    <template #body>
      <slot />
    </template>
  </USlideover>
</template>

