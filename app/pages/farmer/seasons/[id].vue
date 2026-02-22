<script setup lang="ts">
definePageMeta({
  layout: "farmer",
  middleware: ["auth"],
});

const route = useRoute();
const seasonId = route.params.id as string;

const { data: season, status } = await useFetch(`/api/seasons/${seasonId}`, {
  server: false,
});
</script>

<template>
  <UDashboardPanel id="farmer-season-detail">
    <template #header>
      <UDashboardNavbar :title="season?.name || 'Season'">
        <template #leading>
          <UDashboardSidebarCollapse />
          <UButton
            icon="i-lucide-arrow-left"
            color="neutral"
            variant="ghost"
            to="/farmer/seasons"
            class="mr-2"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div v-if="status === 'pending'" class="flex justify-center py-12">
        <UIcon name="i-lucide-loader-circle" class="size-8 animate-spin text-muted" />
      </div>

      <div v-else-if="!season" class="text-center py-12">
        <UIcon name="i-lucide-calendar" class="size-12 text-muted mx-auto mb-2" />
        <p class="text-sm text-muted">Season not found</p>
      </div>

      <div v-else class="space-y-6">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Farm"
            :value="season.farm?.name || 'Unknown'"
            icon="i-lucide-tractor"
            color="text-blue-500"
            bg="bg-blue-500/10"
          />
          <StatCard
            label="Year"
            :value="String(season.year)"
            icon="i-lucide-calendar"
            color="text-green-500"
            bg="bg-green-500/10"
          />
          <StatCard
            label="Crop Type"
            :value="season.cropType || 'N/A'"
            icon="i-lucide-sprout"
            color="text-amber-500"
            bg="bg-amber-500/10"
          />
          <StatCard
            label="Status"
            :value="season.status"
            icon="i-lucide-activity"
            color="text-primary"
            bg="bg-primary/10"
          />
        </div>

        <UCard>
          <template #header>
            <h4 class="font-semibold">Dates</h4>
          </template>
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div class="flex items-center gap-3">
              <UIcon name="i-lucide-calendar-plus" class="size-5 text-muted" />
              <div>
                <p class="text-sm text-muted">Start</p>
                <p class="font-medium text-highlighted">{{ formatDate(season.startDate) }}</p>
              </div>
            </div>
            <div v-if="season.endDate" class="flex items-center gap-3">
              <UIcon name="i-lucide-calendar-minus" class="size-5 text-muted" />
              <div>
                <p class="text-sm text-muted">End</p>
                <p class="font-medium text-highlighted">{{ formatDate(season.endDate) }}</p>
              </div>
            </div>
          </div>
        </UCard>
      </div>
    </template>
  </UDashboardPanel>
</template>
