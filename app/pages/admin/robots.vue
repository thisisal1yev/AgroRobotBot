<script setup lang="ts">
definePageMeta({
  layout: "admin",
  middleware: ["auth"],
});

const { data: robots, status } = await useFetch("/api/robots", {
  server: false,
});

function statusColor(s: string) {
  if (s === "ONLINE") return "success";
  if (s === "IN_MISSION") return "warning";
  if (s === "CHARGING") return "info";
  return "neutral";
}
</script>

<template>
  <UDashboardPanel id="admin-robots">
    <template #header>
      <UDashboardNavbar title="Robots">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div v-if="status === 'pending'" class="flex justify-center py-12">
        <UIcon name="i-lucide-loader-circle" class="size-8 animate-spin text-muted" />
      </div>

      <div v-else-if="!robots?.length" class="text-center py-12">
        <UIcon name="i-lucide-bot" class="size-12 text-muted mx-auto mb-2" />
        <p class="text-sm text-muted">No robots found</p>
      </div>

      <div v-else class="grid gap-3">
        <UCard v-for="robot in robots" :key="robot.id">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3 flex-1 min-w-0">
              <div class="flex size-10 items-center justify-center rounded-full bg-purple-500/10">
                <UIcon name="i-lucide-bot" class="size-5 text-purple-500" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-medium text-highlighted truncate">{{ robot.name }}</p>
                <p class="text-sm text-muted truncate">
                  {{ robot.farm?.name }} &middot; SN: {{ robot.serialNumber }}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-2 ml-4">
              <UBadge :color="statusColor(robot.status)" variant="subtle" size="xs" :label="robot.status" />
              <div class="flex items-center gap-1 text-xs text-muted">
                <UIcon name="i-lucide-battery" class="size-3.5" />
                {{ robot.batteryLevel }}%
              </div>
              <UBadge variant="subtle" size="xs" color="neutral">
                {{ robot._count.missions }} mission{{ robot._count.missions !== 1 ? "s" : "" }}
              </UBadge>
            </div>
          </div>
        </UCard>
      </div>
    </template>
  </UDashboardPanel>
</template>
