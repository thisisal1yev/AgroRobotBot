<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const props = defineProps<{
  sidebarId: string;
  links: NavigationMenuItem[][];
  hotkeys: { keys: string; action: string }[];
}>();

const open = ref(false);
</script>

<template>
  <UDashboardGroup unit="rem">
    <UDashboardSidebar
      :id="sidebarId"
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

    <UDashboardSearch :groups="[{ id: 'links', label: 'Go to', items: links.flat() }]" />

    <slot />
  </UDashboardGroup>
</template>
