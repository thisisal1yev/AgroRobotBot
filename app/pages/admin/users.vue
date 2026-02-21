<script setup lang="ts">
definePageMeta({
  layout: "admin",
  middleware: ["auth"],
});

const { data: users, status } = await useFetch("/api/admin/users", {
  server: false,
});

const columns = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "role", label: "Role" },
  { key: "farms", label: "Farms" },
  { key: "createdAt", label: "Joined" },
];

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
</script>

<template>
  <UDashboardPanel id="admin-users">
    <template #header>
      <UDashboardNavbar title="Users">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div v-if="status === 'pending'" class="flex justify-center py-12">
        <UIcon name="i-lucide-loader-circle" class="size-8 animate-spin text-muted" />
      </div>

      <div v-else-if="!users?.length" class="text-center py-12">
        <UIcon name="i-lucide-user-x" class="size-12 text-muted mx-auto mb-2" />
        <p class="text-sm text-muted">No users found</p>
      </div>

      <div v-else class="space-y-4">
        <div class="grid gap-3">
          <UCard v-for="u in users" :key="u.id">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3 flex-1 min-w-0">
                <div class="flex size-10 items-center justify-center rounded-full bg-primary/10">
                  <UIcon name="i-lucide-user" class="size-5 text-primary" />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="font-medium text-highlighted truncate">
                    {{ u.name || "Unnamed" }}
                  </p>
                  <p class="text-sm text-muted truncate">{{ u.email }}</p>
                </div>
              </div>
              <div class="flex items-center gap-3 ml-4">
                <UBadge
                  :color="u.role === 'ADMIN' ? 'error' : 'success'"
                  variant="subtle"
                  size="xs"
                  :label="u.role"
                />
                <div class="text-right">
                  <p class="text-xs text-muted">{{ formatDate(u.createdAt) }}</p>
                  <p class="text-xs text-muted">
                    {{ u._count.farms }} farm{{ u._count.farms !== 1 ? "s" : "" }}
                  </p>
                </div>
              </div>
            </div>
          </UCard>
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>
