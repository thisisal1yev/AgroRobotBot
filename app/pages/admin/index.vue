<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";

definePageMeta({
  layout: "admin",
  middleware: ["auth"],
});

const items = computed<DropdownMenuItem[][]>(() => [
  [
    { label: "Add User", icon: "i-lucide-user-plus", to: "/admin/users" },
    { label: "Add Farm", icon: "i-lucide-tractor", to: "/admin/farms" },
    { label: "Add Field", icon: "i-lucide-map-pin", to: "/admin/fields" },
  ],
]);

const { data: me } = await useFetch("/api/auth/me", { server: false });
const { data: stats } = await useFetch("/api/admin/stats", { server: false });
const { data: users } = await useFetch("/api/admin/users", { server: false });
const { data: alerts } = await useFetch("/api/alerts", {
  server: false,
  query: { status: "ACTIVE" },
});

const statCards = computed(() => [
  {
    label: "Users",
    value: stats.value?.users ?? 0,
    icon: "i-lucide-users",
    color: "text-primary",
    bg: "bg-primary/10",
    to: "/admin/users",
  },
  {
    label: "Farms",
    value: stats.value?.farms ?? 0,
    icon: "i-lucide-tractor",
    color: "text-green-500",
    bg: "bg-green-500/10",
    to: "/admin/farms",
  },
  {
    label: "Fields",
    value: stats.value?.fields ?? 0,
    icon: "i-lucide-map",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    to: "/admin/fields",
  },
  {
    label: "Robots",
    value: stats.value?.robots ?? 0,
    icon: "i-lucide-bot",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    to: "/admin/robots",
  },
]);

const secondaryStats = computed(() => [
  {
    label: "Active Alerts",
    value: stats.value?.activeAlerts ?? 0,
    icon: "i-lucide-bell-ring",
    color: stats.value?.activeAlerts ? "text-error" : "text-success",
  },
  {
    label: "Active Missions",
    value: stats.value?.activeMissions ?? 0,
    icon: "i-lucide-radar",
    color: stats.value?.activeMissions ? "text-warning" : "text-muted",
  },
  {
    label: "Telemetry Readings",
    value: stats.value?.totalReadings ?? 0,
    icon: "i-lucide-activity",
    color: "text-info",
  },
]);

const recentUsers = computed(() => (users.value ?? []).slice(0, 5));
const activeAlerts = computed(() => (alerts.value ?? []).slice(0, 5));
</script>

<template>
  <UDashboardPanel id="admin-dashboard">
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
            <strong>{{ me?.name ?? "Admin" }}!</strong>
          </h3>
          <p class="text-muted text-sm">
            System overview and management panel
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
              to="/admin/users"
              color="primary"
              variant="soft"
              block
              icon="i-lucide-users"
              label="Manage Users"
            />
            <UButton
              to="/admin/farms"
              color="info"
              variant="soft"
              block
              icon="i-lucide-tractor"
              label="Manage Farms"
            />
            <UButton
              to="/admin/reports"
              color="success"
              variant="soft"
              block
              icon="i-lucide-bar-chart-3"
              label="View Reports"
            />
          </div>
        </UCard>

        <!-- Recent Users + Active Alerts -->
        <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <UCard class="mb-auto">
            <template #header>
              <div class="flex items-center justify-between">
                <h4 class="font-semibold">Recent Users</h4>
                <UButton
                  to="/admin/users"
                  variant="ghost"
                  size="xs"
                  icon="i-lucide-arrow-right"
                  label="View all"
                />
              </div>
            </template>

            <div v-if="!recentUsers.length" class="text-center py-8">
              <UIcon
                name="i-lucide-user-x"
                class="size-12 text-muted mx-auto mb-2"
              />
              <p class="text-sm text-muted">No users yet</p>
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="u in recentUsers"
                :key="u.id"
                class="flex items-center justify-between p-3 rounded-lg hover:bg-elevated/50 transition-colors"
              >
                <div class="flex items-center gap-3 flex-1 min-w-0">
                  <div
                    class="flex size-10 items-center justify-center rounded-full bg-primary/10"
                  >
                    <UIcon name="i-lucide-user" class="size-5 text-primary" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="font-medium text-highlighted truncate">
                      {{ u.name || "Unnamed" }}
                    </p>
                    <p class="text-sm text-muted truncate">{{ u.email }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-3 ml-4">
                  <UBadge
                    :color="u.role === 'ADMIN' ? 'error' : 'success'"
                    variant="subtle"
                    size="xs"
                    :label="u.role"
                  />
                  <div class="text-right">
                    <p class="text-xs text-muted">
                      {{ formatDate(u.createdAt) }}
                    </p>
                    <p class="text-xs text-muted">
                      {{ pluralize(u._count.farms, "farm") }}
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
                  to="/admin/alerts"
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
