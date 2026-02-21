<script setup lang="ts">
definePageMeta({
  layout: "admin",
  middleware: ["auth"],
});

const { data: fields, status } = await useFetch("/api/fields", {
  server: false,
});
</script>

<template>
  <UDashboardPanel id="admin-fields">
    <template #header>
      <UDashboardNavbar title="Fields">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div v-if="status === 'pending'" class="flex justify-center py-12">
        <UIcon name="i-lucide-loader-circle" class="size-8 animate-spin text-muted" />
      </div>

      <div v-else-if="!fields?.length" class="text-center py-12">
        <UIcon name="i-lucide-map" class="size-12 text-muted mx-auto mb-2" />
        <p class="text-sm text-muted">No fields found</p>
      </div>

      <div v-else class="grid gap-3">
        <UCard v-for="field in fields" :key="field.id">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3 flex-1 min-w-0">
              <div class="flex size-10 items-center justify-center rounded-full bg-blue-500/10">
                <UIcon name="i-lucide-map-pin" class="size-5 text-blue-500" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-medium text-highlighted truncate">{{ field.name }}</p>
                <p class="text-sm text-muted truncate">
                  {{ field.farm?.name }} &middot; {{ field.cropType }}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-2 ml-4">
              <UBadge variant="subtle" size="xs" color="neutral">
                {{ field.area }} ha
              </UBadge>
              <UBadge v-if="field._count.alerts" variant="subtle" size="xs" color="error">
                {{ field._count.alerts }} alert{{ field._count.alerts !== 1 ? "s" : "" }}
              </UBadge>
              <UBadge variant="subtle" size="xs" color="info">
                {{ field._count.telemetryReadings }} reading{{ field._count.telemetryReadings !== 1 ? "s" : "" }}
              </UBadge>
            </div>
          </div>
        </UCard>
      </div>
    </template>
  </UDashboardPanel>
</template>
