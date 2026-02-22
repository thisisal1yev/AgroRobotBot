<script setup lang="ts">
definePageMeta({
  layout: "admin",
  middleware: ["auth"],
});

const sections = [
  {
    title: "Dashboard",
    icon: "i-lucide-layout-dashboard",
    description: "View system-wide statistics including total users, farms, fields, robots, active alerts, and missions.",
  },
  {
    title: "Users",
    icon: "i-lucide-users",
    description: "View and manage all registered users. See their roles, farm counts, and registration dates.",
  },
  {
    title: "Farms",
    icon: "i-lucide-tractor",
    description: "Browse all farms in the system with their owners, locations, soil types, and associated field/robot counts.",
  },
  {
    title: "Fields",
    icon: "i-lucide-map",
    description: "Monitor all fields across farms. Track crop types, telemetry readings, and alert statuses.",
  },
  {
    title: "Reports",
    icon: "i-lucide-bar-chart-3",
    description: "Access generated reports for any farm. Download report files when available.",
  },
  {
    title: "Keyboard Shortcuts",
    icon: "i-lucide-keyboard",
    description: "Use G+H for Dashboard, G+U for Users, G+F for Farms, G+M for Fields, G+R for Reports, G+S for Settings.",
  },
];
</script>

<template>
  <UDashboardPanel id="admin-help">
    <template #header>
      <UDashboardNavbar title="Help">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="grid-cols-2 grid gap-x-5 gap-y-3">
        <UCard v-for="section in sections" :key="section.title">
          <div class="flex items-start gap-3">
            <div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <UIcon :name="section.icon" class="size-5 text-primary" />
            </div>
            <div>
              <h4 class="font-semibold text-highlighted">{{ section.title }}</h4>
              <p class="text-sm text-muted mt-1">{{ section.description }}</p>
            </div>
          </div>
        </UCard>
      </div>
    </template>
  </UDashboardPanel>
</template>
