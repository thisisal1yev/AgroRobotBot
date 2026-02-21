<script setup lang="ts">
definePageMeta({
  layout: "farmer",
  middleware: ["auth"],
});

const { data: analyses, status } = await useFetch("/api/plant-analyses", {
  server: false,
});

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
</script>

<template>
  <UDashboardPanel id="farmer-predictions">
    <template #header>
      <UDashboardNavbar title="Predictions">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div v-if="status === 'pending'" class="flex justify-center py-12">
        <UIcon name="i-lucide-loader-circle" class="size-8 animate-spin text-muted" />
      </div>

      <div v-else-if="!analyses?.length" class="text-center py-12">
        <UIcon name="i-lucide-brain" class="size-12 text-muted mx-auto mb-2" />
        <p class="text-sm text-muted">No plant analyses yet</p>
      </div>

      <div v-else class="grid gap-3">
        <UCard v-for="a in analyses" :key="a.id">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3 flex-1 min-w-0">
              <div
                :class="[
                  'flex size-10 items-center justify-center rounded-full',
                  a.healthy ? 'bg-success/10' : 'bg-error/10',
                ]"
              >
                <UIcon
                  :name="a.healthy ? 'i-lucide-heart-pulse' : 'i-lucide-bug'"
                  :class="['size-5', a.healthy ? 'text-success' : 'text-error']"
                />
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-medium text-highlighted truncate">
                  {{ a.healthy ? "Healthy" : a.disease || "Disease detected" }}
                </p>
                <p class="text-sm text-muted truncate">
                  {{ a.field?.name }} &mdash; {{ a.field?.farm?.name }}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-2 ml-4">
              <UBadge
                :color="a.healthy ? 'success' : 'error'"
                variant="subtle"
                size="xs"
                :label="a.healthy ? 'Healthy' : 'Diseased'"
              />
              <UBadge variant="subtle" size="xs" color="neutral">
                {{ Math.round(a.confidence * 100) }}%
              </UBadge>
              <span class="text-xs text-muted">{{ formatDate(a.createdAt) }}</span>
            </div>
          </div>
        </UCard>
      </div>
    </template>
  </UDashboardPanel>
</template>
