<script lang="ts" setup>
import { LANDING_NAV } from "~/constants/navigation";

const footerNav = computed(() =>
  [...LANDING_NAV, { label: "Contact", href: "#contact" }].map((x) => ({
    label: x.label,
    to: x.href,
  })),
);
</script>

<template>
  <UFooter class="border-t border-default">
    <template #left>
      <div class="flex items-center gap-2">
        <UIcon name="i-lucide-leaf" class="h-5 w-5 text-green-600" />
        <div class="text-sm font-semibold">AgroDoctorBot</div>
        <div class="text-xs text-neutral-500">
          © {{ new Date().getFullYear() }}
        </div>
      </div>
    </template>

    <template #right>
      <UNavigationMenu :items="footerNav" class="text-sm" />
    </template>
  </UFooter>
</template>
