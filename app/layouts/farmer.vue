<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const links = computed<NavigationMenuItem[][]>(() => [
  [
    { label: "Dashboard", icon: "i-lucide-layout-dashboard", to: "/farmer" },
    { label: "My Farms", icon: "i-lucide-tractor", to: "/farmer/farms" },
    { label: "Fields", icon: "i-lucide-map", to: "/farmer/fields" },
    { label: "Seasons", icon: "i-lucide-calendar", to: "/farmer/seasons" },
    { label: "Predictions", icon: "i-lucide-brain", to: "/farmer/predictions" },
    { label: "Alerts", icon: "i-lucide-bell", to: "/farmer/alerts" },
  ],
  [
    { label: "Settings", icon: "i-lucide-settings", to: "/farmer/settings" },
    { label: "Help", icon: "i-lucide-circle-help", to: "/farmer/help" },
  ],
]);

const hotkeys = [
  { keys: "G - H", action: "Dashboard" },
  { keys: "G - F", action: "My Farms" },
  { keys: "G - M", action: "Fields" },
  { keys: "G - S", action: "Seasons" },
  { keys: "G - P", action: "Predictions" },
  { keys: "G - A", action: "Alerts" },
];
</script>

<template>
  <DashboardSidebar sidebar-id="farmer" :links="links" :hotkeys="hotkeys">
    <slot />
  </DashboardSidebar>
</template>
