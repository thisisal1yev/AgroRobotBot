<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";

definePageMeta({
  layout: "admin",
  middleware: ["auth"],
});

const items = computed<DropdownMenuItem[][]>(() => [
  [
    {
      label: "Add User",
      icon: "i-lucide-user-plus",
      to: "/admin/users",
    },
    {
      label: "Add Farm",
      icon: "i-lucide-tractor",
      to: "/admin/farms",
    },
    {
      label: "Add Field",
      icon: "i-lucide-map-pin",
      to: "/admin/fields",
    },
  ],
]);

const { data } = await useFetch("/api/auth/me", { server: false });
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
            <strong>{{ data?.name ?? "Admin" }}!</strong>
          </h3>
          <p class="text-muted text-sm">
            System overview and management panel
          </p>
        </div>
      </section>

      <section class="space-y-6">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <UCard>
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-users" class="size-5 text-primary" />
                <h4 class="font-semibold">Users</h4>
              </div>
            </template>
            <div class="text-3xl font-bold text-highlighted">—</div>
            <p class="text-sm text-muted mt-1">Total registered users</p>
          </UCard>

          <UCard>
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-tractor" class="size-5 text-green-500" />
                <h4 class="font-semibold">Farms</h4>
              </div>
            </template>
            <div class="text-3xl font-bold text-highlighted">—</div>
            <p class="text-sm text-muted mt-1">Total farms</p>
          </UCard>

          <UCard>
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-map" class="size-5 text-blue-500" />
                <h4 class="font-semibold">Fields</h4>
              </div>
            </template>
            <div class="text-3xl font-bold text-highlighted">—</div>
            <p class="text-sm text-muted mt-1">Total fields</p>
          </UCard>

          <UCard>
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon
                  name="i-lucide-bar-chart-3"
                  class="size-5 text-orange-500"
                />
                <h4 class="font-semibold">Reports</h4>
              </div>
            </template>
            <div class="text-3xl font-bold text-highlighted">—</div>
            <p class="text-sm text-muted mt-1">Generated reports</p>
          </UCard>
        </div>

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

            <div class="text-center py-8">
              <UIcon
                name="i-lucide-user-x"
                class="size-12 text-muted mx-auto mb-2"
              />
              <p class="text-sm text-muted">No users yet</p>
            </div>
          </UCard>

          <UCard class="mb-auto">
            <template #header>
              <div class="flex items-center justify-between">
                <h4 class="font-semibold">Recent Activity</h4>
                <UButton
                  to="/admin/reports"
                  variant="ghost"
                  size="xs"
                  icon="i-lucide-arrow-right"
                  label="View all"
                />
              </div>
            </template>

            <div class="text-center py-8">
              <UIcon
                name="i-lucide-activity"
                class="size-12 text-muted mx-auto mb-2"
              />
              <p class="text-sm text-muted">No recent activity</p>
            </div>
          </UCard>
        </div>
      </section>
    </template>
  </UDashboardPanel>
</template>
