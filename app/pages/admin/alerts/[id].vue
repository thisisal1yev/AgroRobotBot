<script setup lang="ts">
definePageMeta({
  layout: "admin",
  middleware: ["auth"],
});

const route = useRoute();
const alertId = route.params.id as string;

const { data: alert, status } = await useFetch(`/api/alerts/${alertId}`, {
  server: false,
});
</script>

<template>
  <UDashboardPanel id="admin-alert-detail">
    <template #header>
      <UDashboardNavbar :title="alert?.title || 'Alert'">
        <template #leading>
          <UDashboardSidebarCollapse />
          <UButton
            icon="i-lucide-arrow-left"
            color="neutral"
            variant="ghost"
            to="/admin/alerts"
            class="mr-2"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div v-if="status === 'pending'" class="flex justify-center py-12">
        <UIcon name="i-lucide-loader-circle" class="size-8 animate-spin text-muted" />
      </div>

      <div v-else-if="!alert" class="text-center py-12">
        <UIcon name="i-lucide-bell" class="size-12 text-muted mx-auto mb-2" />
        <p class="text-sm text-muted">Alert not found</p>
      </div>

      <div v-else class="space-y-6">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Field"
            :value="alert.field?.name || 'Unknown'"
            icon="i-lucide-map"
            color="text-blue-500"
            bg="bg-blue-500/10"
          />
          <StatCard
            label="Farm"
            :value="alert.field?.farm?.name || 'Unknown'"
            icon="i-lucide-tractor"
            color="text-green-500"
            bg="bg-green-500/10"
          />
          <StatCard
            label="Severity"
            :value="alert.severity"
            icon="i-lucide-alert-triangle"
            color="text-amber-500"
            bg="bg-amber-500/10"
          />
          <StatCard
            label="Status"
            :value="alert.status"
            icon="i-lucide-info"
            color="text-primary"
            bg="bg-primary/10"
          />
        </div>

        <UCard>
          <template #header>
            <span class="font-semibold">Created</span>
            <span class="text-muted text-sm ml-2">{{ formatDate(alert.createdAt) }}</span>
            <UBadge
              v-if="alert.resolvedAt"
              color="success"
              variant="subtle"
              size="xs"
              :label="`Resolved ${formatDate(alert.resolvedAt)}`"
              class="ml-2"
            />
          </template>
          <p class="text-highlighted whitespace-pre-wrap">{{ alert.message }}</p>
        </UCard>
      </div>
    </template>
  </UDashboardPanel>
</template>
