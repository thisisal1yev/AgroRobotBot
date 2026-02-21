<script setup lang="ts">
definePageMeta({
  layout: "farmer",
  middleware: ["auth"],
});

const sections = [
  {
    title: "Dashboard",
    icon: "i-lucide-layout-dashboard",
    description: "Overview of your farms, fields, seasons, robots, active alerts, and pending recommendations.",
  },
  {
    title: "My Farms",
    icon: "i-lucide-tractor",
    description: "Manage your farms. View location, area, soil type, and the number of fields and robots per farm.",
  },
  {
    title: "Fields",
    icon: "i-lucide-map",
    description: "Browse your fields across all farms. Track crop types, telemetry readings, and alert counts.",
  },
  {
    title: "Seasons",
    icon: "i-lucide-calendar",
    description: "Plan and track growing seasons for your farms. View crop types, dates, and statuses.",
  },
  {
    title: "Predictions",
    icon: "i-lucide-brain",
    description: "View plant health analyses. See disease detection results with confidence scores for your fields.",
  },
  {
    title: "Keyboard Shortcuts",
    icon: "i-lucide-keyboard",
    description: "Use G+H for Dashboard, G+F for Farms, G+M for Fields, G+S for Seasons, G+P for Predictions.",
  },
];
</script>

<template>
  <UDashboardPanel id="farmer-help">
    <template #header>
      <UDashboardNavbar title="Help">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="max-w-2xl space-y-4">
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
