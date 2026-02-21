<script setup lang="ts">
definePageMeta({
  layout: "admin",
  middleware: ["auth"],
});

const { data: farms, status } = await useFetch("/api/farms", {
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
  <UDashboardPanel id="admin-farms">
    <template #header>
      <UDashboardNavbar title="Farms">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div v-if="status === 'pending'" class="flex justify-center py-12">
        <UIcon name="i-lucide-loader-circle" class="size-8 animate-spin text-muted" />
      </div>

      <div v-else-if="!farms?.length" class="text-center py-12">
        <UIcon name="i-lucide-tractor" class="size-12 text-muted mx-auto mb-2" />
        <p class="text-sm text-muted">No farms found</p>
      </div>

      <div v-else class="grid gap-3">
        <UCard v-for="farm in farms" :key="farm.id">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3 flex-1 min-w-0">
              <div class="flex size-10 items-center justify-center rounded-full bg-green-500/10">
                <UIcon name="i-lucide-tractor" class="size-5 text-green-500" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-medium text-highlighted truncate">{{ farm.name }}</p>
                <p class="text-sm text-muted truncate">{{ farm.location || "No location" }}</p>
              </div>
            </div>
            <div class="flex items-center gap-4 ml-4">
              <div class="text-right text-xs text-muted space-y-0.5">
                <p>Owner: {{ farm.owner?.name || "Unknown" }}</p>
                <p>{{ farm.area }} ha &middot; {{ farm.soilType }}</p>
              </div>
              <div class="flex gap-2">
                <UBadge variant="subtle" size="xs" color="info">
                  {{ farm._count.fields }} field{{ farm._count.fields !== 1 ? "s" : "" }}
                </UBadge>
                <UBadge variant="subtle" size="xs" color="neutral">
                  {{ farm._count.robots }} robot{{ farm._count.robots !== 1 ? "s" : "" }}
                </UBadge>
              </div>
            </div>
          </div>
        </UCard>
      </div>
    </template>
  </UDashboardPanel>
</template>
