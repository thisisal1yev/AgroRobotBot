<script setup lang="ts">
const open = defineModel<boolean>('open', { default: false })

const props = withDefaults(defineProps<{
  title?: string
  message?: string
  confirmText?: string
  confirmColor?: 'error' | 'primary' | 'neutral'
  loading?: boolean
}>(), {
  title: 'Confirm',
  message: 'Are you sure?',
  confirmText: 'Confirm',
  confirmColor: 'error',
  loading: false
})

const emit = defineEmits<{
  confirm: []
}>()
</script>

<template>
  <UModal v-model:open="open">
    <template #content>
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">{{ title }}</h3>
            <UButton icon="i-lucide-x" color="neutral" variant="ghost" square @click="open = false" />
          </div>
        </template>

        <p class="text-sm text-muted">{{ message }}</p>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton label="Cancel" color="neutral" variant="outline" @click="open = false" />
            <UButton :label="confirmText" :color="confirmColor" :loading="loading" @click="emit('confirm')" />
          </div>
        </template>
      </UCard>
    </template>
  </UModal>
</template>
