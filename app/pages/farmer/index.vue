<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";

definePageMeta({
  layout: "farmer",
  middleware: ["auth"],
});

const items = computed<DropdownMenuItem[][]>(() => [
  [
    {
      label: "Add Farm",
      icon: "i-lucide-tractor",
      to: "/farmer/farms",
    },
    {
      label: "Add Field",
      icon: "i-lucide-map-pin",
      to: "/farmer/fields",
    },
    {
      label: "New Prediction",
      icon: "i-lucide-brain",
      to: "/farmer/predictions",
    },
  ],
]);

const { data } = await useFetch("/api/auth/me", { server: false });
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
            <strong>{{ data?.name ?? "Farmer" }}!</strong>
          </h3>
          <p class="text-muted text-sm">
            Manage your farms and agricultural data
          </p>
        </div>
      </section>

      <section class="space-y-6">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <UCard>
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-tractor" class="size-5 text-primary" />
                <h4 class="font-semibold">My Farms</h4>
              </div>
            </template>
            <div class="text-3xl font-bold text-highlighted">—</div>
            <p class="text-sm text-muted mt-1">Your farms</p>
          </UCard>

          <UCard>
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-map" class="size-5 text-green-500" />
                <h4 class="font-semibold">Fields</h4>
              </div>
            </template>
            <div class="text-3xl font-bold text-highlighted">—</div>
            <p class="text-sm text-muted mt-1">Active fields</p>
          </UCard>

          <UCard>
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon
                  name="i-lucide-calendar"
                  class="size-5 text-blue-500"
                />
                <h4 class="font-semibold">Seasons</h4>
              </div>
            </template>
            <div class="text-3xl font-bold text-highlighted">—</div>
            <p class="text-sm text-muted mt-1">Active seasons</p>
          </UCard>

          <UCard>
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-brain" class="size-5 text-purple-500" />
                <h4 class="font-semibold">Predictions</h4>
              </div>
            </template>
            <div class="text-3xl font-bold text-highlighted">—</div>
            <p class="text-sm text-muted mt-1">ML predictions</p>
          </UCard>
        </div>

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

        <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <UCard class="mb-auto">
            <template #header>
              <div class="flex items-center justify-between">
                <h4 class="font-semibold">Recent Predictions</h4>
                <UButton
                  to="/farmer/predictions"
                  variant="ghost"
                  size="xs"
                  icon="i-lucide-arrow-right"
                  label="View all"
                />
              </div>
            </template>

            <div class="text-center py-8">
              <UIcon
                name="i-lucide-brain"
                class="size-12 text-muted mx-auto mb-2"
              />
              <p class="text-sm text-muted">No predictions yet</p>
            </div>
          </UCard>

          <UCard class="mb-auto">
            <template #header>
              <div class="flex items-center justify-between">
                <h4 class="font-semibold">Season Overview</h4>
                <UButton
                  to="/farmer/seasons"
                  variant="ghost"
                  size="xs"
                  icon="i-lucide-arrow-right"
                  label="View all"
                />
              </div>
            </template>

            <div class="text-center py-8">
              <UIcon
                name="i-lucide-calendar"
                class="size-12 text-muted mx-auto mb-2"
              />
              <p class="text-sm text-muted">No active seasons</p>
            </div>
          </UCard>
        </div>
      </section>
    </template>
  </UDashboardPanel>
</template>
