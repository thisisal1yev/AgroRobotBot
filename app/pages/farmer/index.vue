<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";

definePageMeta({
  layout: "farmer",
  middleware: ["auth"],
});

const items = computed<DropdownMenuItem[][]>(() => [
  [
    { label: "Add Farm", icon: "i-lucide-tractor", to: "/farmer/farms" },
    { label: "Add Field", icon: "i-lucide-map-pin", to: "/farmer/fields" },
    { label: "New Prediction", icon: "i-lucide-brain", to: "/farmer/predictions" },
  ],
]);

const { data: me } = await useFetch("/api/auth/me", { server: false });
const { data: farms } = await useFetch("/api/farms", { server: false });
const { data: fields } = await useFetch("/api/fields", { server: false });
const { data: seasons } = await useFetch("/api/seasons", { server: false });
const { data: robots } = await useFetch("/api/robots", { server: false });
const { data: alerts } = await useFetch("/api/alerts", {
  server: false,
  query: { status: "ACTIVE" },
});
const { data: recommendations } = await useFetch("/api/recommendations", {
  server: false,
  query: { applied: "false" },
});

const statCards = computed(() => [
  {
    label: "My Farms",
    value: farms.value?.length ?? 0,
    icon: "i-lucide-tractor",
    color: "text-primary",
    bg: "bg-primary/10",
    to: "/farmer/farms",
  },
  {
    label: "Fields",
    value: fields.value?.length ?? 0,
    icon: "i-lucide-map",
    color: "text-green-500",
    bg: "bg-green-500/10",
    to: "/farmer/fields",
  },
  {
    label: "Seasons",
    value: seasons.value?.length ?? 0,
    icon: "i-lucide-calendar",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    to: "/farmer/seasons",
  },
  {
    label: "Robots",
    value: robots.value?.length ?? 0,
    icon: "i-lucide-bot",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    to: "/farmer/robots",
  },
]);

const secondaryStats = computed(() => [
  {
    label: "Active Alerts",
    value: alerts.value?.length ?? 0,
    icon: "i-lucide-bell-ring",
    color: alerts.value?.length ? "text-error" : "text-success",
  },
  {
    label: "Pending Recommendations",
    value: recommendations.value?.length ?? 0,
    icon: "i-lucide-lightbulb",
    color: recommendations.value?.length ? "text-warning" : "text-muted",
  },
  {
    label: "Total Fields",
    value: fields.value?.reduce((sum, f) => sum + (f._count?.telemetryReadings ?? 0), 0) ?? 0,
    icon: "i-lucide-activity",
    color: "text-info",
  },
]);

const recentFarms = computed(() => (farms.value ?? []).slice(0, 5));
const activeAlerts = computed(() => (alerts.value ?? []).slice(0, 5));
</script>

<template>
  <UDashboardPanel id="farmer-dashboard">
    <template #header>
      <UDashboardNavbar title="Dashboard" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <UDropdownMenu :items="items">
            <UButton icon="i-lucide-plus" size="md" class="rounded-full" />
          </UDropdownMenu>
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <section class="space-y-1 xl:flex items-start justify-between gap-4">
        <div class="mb-6 xl:mb-0">
          <h3 class="text-2xl">
            Welcome,
            <strong>{{ me?.name ?? "Farmer" }}!</strong>
          </h3>
          <p class="text-muted text-sm">
            Manage your farms and agricultural data
          </p>
        </div>
      </section>

      <section class="space-y-6">
        <!-- Primary stats -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            v-for="card in statCards"
            :key="card.label"
            v-bind="card"
          />
        </div>

        <!-- Secondary stats -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <UCard v-for="s in secondaryStats" :key="s.label">
            <div class="flex items-center gap-3">
              <UIcon :name="s.icon" :class="['size-5', s.color]" />
              <div>
                <p class="text-sm text-muted">{{ s.label }}</p>
                <p class="text-xl font-bold text-highlighted">{{ s.value }}</p>
              </div>
            </div>
          </UCard>
        </div>

        <!-- Quick Actions -->
        <UCard>
          <template #header>
            <h4 class="font-semibold">Quick Actions</h4>
          </template>

          <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <UButton
              to="/farmer/farms"
              color="primary"
              variant="soft"
              block
              icon="i-lucide-tractor"
              label="Manage Farms"
            />
            <UButton
              to="/farmer/fields"
              color="info"
              variant="soft"
              block
              icon="i-lucide-map"
              label="Manage Fields"
            />
            <UButton
              to="/farmer/predictions"
              color="success"
              variant="soft"
              block
              icon="i-lucide-brain"
              label="New Prediction"
            />
          </div>
        </UCard>

        <!-- Recent Farms + Active Alerts -->
        <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <UCard class="mb-auto">
            <template #header>
              <div class="flex items-center justify-between">
                <h4 class="font-semibold">My Farms</h4>
                <UButton
                  to="/farmer/farms"
                  variant="ghost"
                  size="xs"
                  icon="i-lucide-arrow-right"
                  label="View all"
                />
              </div>
            </template>

            <div v-if="!recentFarms.length" class="text-center py-8">
              <UIcon
                name="i-lucide-tractor"
                class="size-12 text-muted mx-auto mb-2"
              />
              <p class="text-sm text-muted">No farms yet</p>
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="farm in recentFarms"
                :key="farm.id"
                class="flex items-center justify-between p-3 rounded-lg hover:bg-elevated/50 transition-colors"
              >
                <div class="flex items-center gap-3 flex-1 min-w-0">
                  <div
                    class="flex size-10 items-center justify-center rounded-full bg-primary/10"
                  >
                    <UIcon
                      name="i-lucide-tractor"
                      class="size-5 text-primary"
                    />
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="font-medium text-highlighted truncate">
                      {{ farm.name }}
                    </p>
                    <p class="text-sm text-muted truncate">
                      {{ farm.location || "No location" }}
                    </p>
                  </div>
                </div>
                <div class="flex items-center gap-3 ml-4">
                  <div class="text-right">
                    <p class="text-xs text-muted">
                      {{ pluralize(farm._count.fields, "field") }}
                    </p>
                    <p class="text-xs text-muted">
                      {{ pluralize(farm._count.robots, "robot") }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </UCard>

          <UCard class="mb-auto">
            <template #header>
              <div class="flex items-center justify-between">
                <h4 class="font-semibold">Active Alerts</h4>
                <UButton
                  to="/farmer/alerts"
                  variant="ghost"
                  size="xs"
                  icon="i-lucide-arrow-right"
                  label="View all"
                />
              </div>
            </template>

            <div v-if="!activeAlerts.length" class="text-center py-8">
              <UIcon
                name="i-lucide-check-circle"
                class="size-12 text-success mx-auto mb-2"
              />
              <p class="text-sm text-muted">No active alerts</p>
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="alert in activeAlerts"
                :key="alert.id"
                class="flex items-center justify-between p-3 rounded-lg hover:bg-elevated/50 transition-colors"
              >
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
                    <p class="font-medium text-highlighted truncate">
                      {{ alert.title }}
                    </p>
                    <p class="text-sm text-muted truncate">
                      {{ alert.field.name }} — {{ alert.field.farm.name }}
                    </p>
                  </div>
                </div>
                <div class="ml-4">
                  <UBadge
                    :color="severityColor(alert.severity)"
                    variant="subtle"
                    size="xs"
                    :label="alert.severity"
                  />
                </div>
              </div>
            </div>
          </UCard>
        </div>
      </section>
    </template>
  </UDashboardPanel>
</template>
