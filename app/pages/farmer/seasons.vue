<script setup lang="ts">
definePageMeta({
  layout: "farmer",
  middleware: ["auth"],
});

const { data: seasons, status } = await useFetch("/api/seasons", {
  server: false,
});

function statusColor(s: string) {
  if (s === "ACTIVE") return "success";
  if (s === "PLANNED") return "info";
  return "neutral";
}

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
</script>

<template>
  <UDashboardPanel id="farmer-seasons">
    <template #header>
      <UDashboardNavbar title="Seasons">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div v-if="status === 'pending'" class="flex justify-center py-12">
        <UIcon name="i-lucide-loader-circle" class="size-8 animate-spin text-muted" />
      </div>

      <div v-else-if="!seasons?.length" class="text-center py-12">
        <UIcon name="i-lucide-calendar" class="size-12 text-muted mx-auto mb-2" />
        <p class="text-sm text-muted">No seasons yet</p>
      </div>

      <div v-else class="grid gap-3">
        <UCard v-for="season in seasons" :key="season.id">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3 flex-1 min-w-0">
              <div class="flex size-10 items-center justify-center rounded-full bg-green-500/10">
                <UIcon name="i-lucide-calendar" class="size-5 text-green-500" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-medium text-highlighted truncate">{{ season.name }}</p>
                <p class="text-sm text-muted truncate">
                  {{ season.farm?.name }} &middot; {{ season.cropType }}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-2 ml-4">
              <UBadge :color="statusColor(season.status)" variant="subtle" size="xs" :label="season.status" />
              <span class="text-xs text-muted">
                {{ season.year }} &middot; {{ formatDate(season.startDate) }}
              </span>
            </div>
          </div>
        </UCard>
      </div>
    </template>
  </UDashboardPanel>
</template>
