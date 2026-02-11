<script lang="ts" setup>
const nav = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Use cases", href: "#use-cases" },
  { label: "FAQ", href: "#faq" },
];
</script>

<template>
  <UFooter class="border-t border-default">
    <template #left>
      <div class="flex items-center gap-2">
        <UIcon name="i-lucide-leaf" class="h-5 w-5 text-green-600" />
        <div class="text-sm font-semibold">AgroRobotBot</div>
        <div class="text-xs text-neutral-500">
          © {{ new Date().getFullYear() }}
        </div>
      </div>
    </template>

    <template #right>
      <UNavigationMenu
        :items="
          nav
            .concat([{ label: 'Contact', href: '#contact' }])
            .map((x) => ({ label: x.label, to: x.href }))
        "
        class="text-sm"
      />
    </template>
  </UFooter>
</template>
