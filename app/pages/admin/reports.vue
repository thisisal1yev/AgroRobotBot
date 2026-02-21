<script setup lang="ts">
definePageMeta({
  layout: "admin",
  middleware: ["auth"],
});

const { data: reports, status } = await useFetch("/api/reports", {
  server: false,
});

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
</script>

<template>
  <UDashboardPanel id="admin-reports">
    <template #header>
      <UDashboardNavbar title="Reports">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div v-if="status === 'pending'" class="flex justify-center py-12">
        <UIcon name="i-lucide-loader-circle" class="size-8 animate-spin text-muted" />
      </div>

      <div v-else-if="!reports?.length" class="text-center py-12">
        <UIcon name="i-lucide-bar-chart-3" class="size-12 text-muted mx-auto mb-2" />
        <p class="text-sm text-muted">No reports generated yet</p>
      </div>

      <div v-else class="grid gap-3">
        <UCard v-for="report in reports" :key="report.id">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3 flex-1 min-w-0">
              <div class="flex size-10 items-center justify-center rounded-full bg-emerald-500/10">
                <UIcon name="i-lucide-file-text" class="size-5 text-emerald-500" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-medium text-highlighted truncate">{{ report.title }}</p>
                <p class="text-sm text-muted truncate">
                  {{ report.farm?.name }} &middot; {{ report.type }}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-3 ml-4">
              <div class="text-right text-xs text-muted">
                <p>{{ formatDate(report.generatedAt) }}</p>
                <p>by {{ report.generatedBy?.name || "Unknown" }}</p>
              </div>
              <UButton
                v-if="report.fileUrl"
                :to="report.fileUrl"
                target="_blank"
                icon="i-lucide-download"
                size="xs"
                variant="ghost"
                color="neutral"
              />
            </div>
          </div>
        </UCard>
      </div>
    </template>
  </UDashboardPanel>
</template>
