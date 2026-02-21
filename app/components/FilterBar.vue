<script setup lang="ts">
const model = defineModel<string>({ required: true });

defineProps<{
  options: string[];
}>();
</script>

<template>
  <div class="flex gap-2">
    <UButton
      v-for="f in options"
      :key="f"
      size="xs"
      :variant="model === f ? 'solid' : 'ghost'"
      :color="model === f ? 'primary' : 'neutral'"
      :label="f"
      @click="model = f"
    />
  </div>
</template>
