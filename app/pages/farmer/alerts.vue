<script setup lang="ts">
definePageMeta({
  layout: "farmer",
  middleware: ["auth"],
});

const activeFilter = ref<string>("ALL");
const { data: alerts, status } = await useFetch("/api/alerts", {
  server: false,
});

const filteredAlerts = computed(() => {
  if (activeFilter.value === "ALL") return alerts.value ?? [];
  return (alerts.value ?? []).filter((a) => a.status === activeFilter.value);
});

function severityColor(severity: string) {
  if (severity === "CRITICAL" || severity === "HIGH") return "error";
  if (severity === "MEDIUM") return "warning";
  return "info";
}

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
</script>

<template>
  <UDashboardPanel id="farmer-alerts">
    <template #header>
      <UDashboardNavbar title="Alerts">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <div class="flex gap-2">
            <UButton
              v-for="f in ['ALL', 'ACTIVE', 'RESOLVED']"
              :key="f"
              size="xs"
              :variant="activeFilter === f ? 'solid' : 'ghost'"
              :color="activeFilter === f ? 'primary' : 'neutral'"
              :label="f"
              @click="activeFilter = f"
            />
          </div>
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div v-if="status === 'pending'" class="flex justify-center py-12">
        <UIcon name="i-lucide-loader-circle" class="size-8 animate-spin text-muted" />
      </div>

      <div v-else-if="!filteredAlerts.length" class="text-center py-12">
        <UIcon name="i-lucide-check-circle" class="size-12 text-success mx-auto mb-2" />
        <p class="text-sm text-muted">No alerts</p>
      </div>

      <div v-else class="grid gap-3">
        <UCard v-for="alert in filteredAlerts" :key="alert.id">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3 flex-1 min-w-0">
              <div
                :class="[
                  'flex size-10 items-center justify-center rounded-full',
                  `bg-${severityColor(alert.severity)}/10`,
                ]"
              >
                <UIcon
                  name="i-lucide-triangle-alert"
                  :class="['size-5', `text-${severityColor(alert.severity)}`]"
                />
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-medium text-highlighted truncate">{{ alert.title }}</p>
                <p class="text-sm text-muted truncate">
                  {{ alert.field.name }} &mdash; {{ alert.field.farm.name }}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-2 ml-4">
              <UBadge
                :color="severityColor(alert.severity)"
                variant="subtle"
                size="xs"
                :label="alert.severity"
              />
              <UBadge
                :color="alert.status === 'ACTIVE' ? 'error' : 'success'"
                variant="subtle"
                size="xs"
                :label="alert.status"
              />
              <span class="text-xs text-muted">{{ formatDate(alert.createdAt) }}</span>
            </div>
          </div>
        </UCard>
      </div>
    </template>
  </UDashboardPanel>
</template>
