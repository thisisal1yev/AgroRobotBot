<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

useDashboard();

const links = computed<NavigationMenuItem[][]>(() => [
  [
    { label: "Dashboard", icon: "i-lucide-layout-dashboard", to: "/admin" },
    { label: "Users", icon: "i-lucide-users", to: "/admin/users" },
    { label: "Farms", icon: "i-lucide-tractor", to: "/admin/farms" },
    { label: "Fields", icon: "i-lucide-map", to: "/admin/fields" },
    { label: "Reports", icon: "i-lucide-bar-chart-3", to: "/admin/reports" },
    { label: "Alerts", icon: "i-lucide-bell", to: "/admin/alerts" },
    { label: "Robots", icon: "i-lucide-bot", to: "/admin/robots" },
  ],
  [
    { label: "Settings", icon: "i-lucide-settings", to: "/admin/settings" },
    { label: "Help", icon: "i-lucide-circle-help", to: "/admin/help" },
  ],
]);

const hotkeys = [
  { keys: "G - H", action: "Dashboard" },
  { keys: "G - U", action: "Users" },
  { keys: "G - F", action: "Farms" },
  { keys: "G - M", action: "Fields" },
  { keys: "G - R", action: "Reports" },
  { keys: "G - A", action: "Alerts" },
  { keys: "G - B", action: "Robots" },
  { keys: "G - S", action: "Settings" },
];
</script>

<template>
  <DashboardSidebar sidebar-id="admin" :links="links" :hotkeys="hotkeys">
    <slot />
  </DashboardSidebar>
</template>
