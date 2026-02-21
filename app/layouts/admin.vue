<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const open = ref(false);

const links = computed<NavigationMenuItem[][]>(() => [
  [
    {
      label: "Dashboard",
      icon: "i-lucide-layout-dashboard",
      to: "/admin",
      onSelect: () => (open.value = false),
    },
    {
      label: "Users",
      icon: "i-lucide-users",
      to: "/admin/users",
      onSelect: () => (open.value = false),
    },
    {
      label: "Farms",
      icon: "i-lucide-tractor",
      to: "/admin/farms",
      onSelect: () => (open.value = false),
    },
    {
      label: "Fields",
      icon: "i-lucide-map",
      to: "/admin/fields",
      onSelect: () => (open.value = false),
    },
    {
      label: "Reports",
      icon: "i-lucide-bar-chart-3",
      to: "/admin/reports",
      onSelect: () => (open.value = false),
    },
  ],
  [
    {
      label: "Settings",
      icon: "i-lucide-settings",
      to: "/admin/settings",
      onSelect: () => (open.value = false),
    },
    {
      label: "Help",
      icon: "i-lucide-circle-help",
      to: "/admin/help",
      onSelect: () => (open.value = false),
    },
  ],
]);

const groups = computed(() => [
  {
    id: "links",
    label: "Go to",
    items: links.value.flat(),
  },
]);

const hotkeys = [
  { keys: "G - H", action: "Dashboard" },
  { keys: "G - U", action: "Users" },
  { keys: "G - F", action: "Farms" },
  { keys: "G - M", action: "Fields" },
  { keys: "G - R", action: "Reports" },
  { keys: "G - S", action: "Settings" },
];
</script>

<template>
  <UDashboardGroup unit="rem">
    <UDashboardSidebar
      id="admin"
      v-model:open="open"
      collapsible
      resizable
      class="bg-elevated/25"
      :ui="{ footer: 'lg:border-t lg:border-default' }"
    >
      <template #default="{ collapsed }">
        <div class="flex items-center gap-1 mt-2.5">
          <UDashboardSearchButton
            :collapsed="collapsed"
            class="bg-transparent ring-default flex-1"
            tooltip
          />

          <UPopover v-if="!collapsed" mode="hover" class="hidden lg:block">
            <UButton icon="i-lucide-keyboard" color="neutral" variant="ghost" />

            <template #content>
              <div class="p-3 space-y-2">
                <p class="text-sm font-medium text-highlighted">
                  Keyboard shortcuts
                </p>
                <div class="space-y-1">
                  <div
                    v-for="hk in hotkeys"
                    :key="hk.keys"
                    class="flex justify-between gap-4 text-sm"
                  >
                    <span class="text-muted">{{ hk.action }}</span>
                    <UKbd>{{ hk.keys }}</UKbd>
                  </div>
                </div>
              </div>
            </template>
          </UPopover>
        </div>

        <UNavigationMenu
          :collapsed="collapsed"
          :items="links[0]"
          orientation="vertical"
          size="xl"
          tooltip
        />

        <UNavigationMenu
          :collapsed="collapsed"
          :items="links[1]"
          orientation="vertical"
          tooltip
          class="mt-auto"
        />
      </template>

      <template #footer="{ collapsed }">
        <UserMenu :collapsed="collapsed" />
      </template>
    </UDashboardSidebar>

    <UDashboardSearch :groups="groups" />

    <slot />
  </UDashboardGroup>
</template>
