<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const colorMode = useColorMode();
const { loggedIn, user } = useUserSession();

const dashboardLink = computed(() =>
  user.value?.role === "ADMIN" ? "/admin" : "/farmer",
);

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

const NAV_LINKS_MOBILE = computed<NavigationMenuItem[]>(() => [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Use cases", href: "#use-cases" },
  { label: "FAQ", href: "#faq" },
]);
</script>

<template>
  <UHeader
    class="sticky top-0 z-50 border-b border-default bg-default/80 backdrop-blur-lg"
  >
    <template #title>
      <NuxtLink to="/" class="flex items-center gap-2 font-semibold">
        <UIcon name="i-lucide-leaf" class="text-primary size-5" />
        AgroDoctorBot
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

        <UButton
          v-if="loggedIn"
          color="primary"
          :to="dashboardLink"
          icon="i-lucide-layout-dashboard"
          label="Dashboard"
        />
        <UButton v-else color="primary" to="/auth" label="Login" />
      </div>
    </template>

    <template #body>
      <UNavigationMenu
        :items="NAV_LINKS_MOBILE"
        orientation="vertical"
        class="-mx-2.5"
      />
    </template>
  </UHeader>
</template>
