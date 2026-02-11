<script setup lang="ts">
const colorMode = useColorMode();

const nav = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Use cases", href: "#use-cases" },
  { label: "FAQ", href: "#faq" },
];

const navItems = computed(() =>
  nav.map((x) => ({
    label: x.label,
    to: x.href,
  })),
);

const toggleTheme = () => {
  colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
};
</script>

<template>
  <UHeader
    class="sticky top-0 z-50 border-b border-default bg-default/80 backdrop-blur-lg"
  >
    <template #title>
      <NuxtLink to="/" class="flex items-center gap-2 font-semibold">
        <UIcon name="i-lucide-leaf" class="text-primary size-5" />
        AgroRobotBot
      </NuxtLink>
    </template>

    <UNavigationMenu class="hidden md:flex" :items="navItems" />

    <template #right>
      <div class="flex items-center gap-2 sm:gap-3">
        <UButton variant="ghost" size="xl" @click="toggleTheme">
          <UIcon
            size="18"
            :name="
              colorMode.value === 'dark' ? 'i-lucide-sun' : 'i-lucide-moon'
            "
          />
        </UButton>

        <UButton color="primary" to="#contact" icon="i-lucide-send">
          Request demo
        </UButton>
      </div>
    </template>
  </UHeader>
</template>
