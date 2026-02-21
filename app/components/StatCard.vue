<script setup lang="ts">
defineProps<{
  label: string;
  value: number | string;
  icon: string;
  color: string;
  bg: string;
  to?: string;
}>();
</script>

<template>
  <component :is="to ? resolveComponent('NuxtLink') : 'div'" :to="to" class="block">
    <UCard :class="to && 'hover:ring-primary/50 hover:ring-1 transition-all cursor-pointer'">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-muted">{{ label }}</p>
          <div class="text-3xl font-bold text-highlighted mt-1">{{ value }}</div>
        </div>
        <div :class="['flex size-12 items-center justify-center rounded-xl', bg]">
          <UIcon :name="icon" :class="['size-6', color]" />
        </div>
      </div>
    </UCard>
  </component>
</template>
