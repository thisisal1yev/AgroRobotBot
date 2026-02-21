<script setup lang="ts">
defineProps<{
  loading: boolean;
  empty: boolean;
  icon: string;
  message: string;
}>();
</script>

<template>
  <div v-if="loading" class="flex justify-center py-12">
    <UIcon name="i-lucide-loader-circle" class="size-8 animate-spin text-muted" />
  </div>

  <div v-else-if="empty" class="text-center py-12">
    <UIcon :name="icon" class="size-12 text-muted mx-auto mb-2" />
    <p class="text-sm text-muted">{{ message }}</p>
  </div>

  <div v-else class="grid gap-3">
    <slot />
  </div>
</template>
