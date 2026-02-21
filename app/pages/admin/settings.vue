<script setup lang="ts">
definePageMeta({
  layout: "admin",
  middleware: ["auth"],
});

const { data: me } = await useFetch("/api/auth/me", { server: false });
</script>

<template>
  <UDashboardPanel id="admin-settings">
    <template #header>
      <UDashboardNavbar title="Settings">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="max-w-2xl space-y-6">
        <UCard>
          <template #header>
            <h4 class="font-semibold">Profile</h4>
          </template>

          <div class="space-y-4">
            <div class="flex items-center gap-4">
              <div class="flex size-16 items-center justify-center rounded-full bg-primary/10">
                <UIcon name="i-lucide-user" class="size-8 text-primary" />
              </div>
              <div>
                <p class="text-lg font-medium text-highlighted">
                  {{ me?.name || "Admin" }}
                </p>
                <p class="text-sm text-muted">{{ me?.email }}</p>
                <UBadge color="error" variant="subtle" label="ADMIN" class="mt-1" />
              </div>
            </div>
          </div>
        </UCard>

        <UCard>
          <template #header>
            <h4 class="font-semibold">Preferences</h4>
          </template>

          <p class="text-sm text-muted">
            Settings and preferences management coming soon.
          </p>
        </UCard>
      </div>
    </template>
  </UDashboardPanel>
</template>
