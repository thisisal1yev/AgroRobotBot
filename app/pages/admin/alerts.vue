<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

definePageMeta({
  layout: "admin",
  middleware: ["auth"],
});

const activeFilter = ref("ALL");
const { data: alerts, status } = await useFetch("/api/alerts", {
  server: false,
});

type Alert = NonNullable<typeof alerts.value>[number]

const filteredAlerts = computed(() => {
  if (activeFilter.value === "ALL") return alerts.value ?? [];
  return (alerts.value ?? []).filter((a) => a.status === activeFilter.value);
});

const deleteSingleMessage = (a: Alert) => `Are you sure you want to delete alert "${a.title}"?`
const deleteBulkMessage = (n: number) => `Are you sure you want to delete ${n} alerts?`

const columns: TableColumn<Alert>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
  },
  {
    id: 'field',
    header: 'Field',
    cell: ({ row }) => row.original.field.name
  },
  {
    id: 'farm',
    header: 'Farm',
    cell: ({ row }) => row.original.field.farm.name
  },
  {
    accessorKey: 'severity',
    header: 'Severity',
    cell: ({ row }) => h(resolveComponent('UBadge'), {
      color: severityColor(row.original.severity),
      variant: 'subtle',
      size: 'xs',
      label: row.original.severity
    })
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => h(resolveComponent('UBadge'), {
      color: row.original.status === 'ACTIVE' ? 'error' : 'success',
      variant: 'subtle',
      size: 'xs',
      label: row.original.status
    })
  },
  {
    accessorKey: 'createdAt',
    header: 'Date',
    cell: ({ row }) => formatDate(row.original.createdAt)
  },
]
</script>

<template>
  <UDashboardPanel id="admin-alerts">
    <template #header>
      <UDashboardNavbar title="Alerts">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <FilterBar v-model="activeFilter" :options="['ALL', 'ACTIVE', 'RESOLVED']" />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <DataTable
        :data="filteredAlerts"
        :columns="columns"
        :loading="status === 'pending'"
        search-key="title"
        search-placeholder="Search alerts..."
        empty-icon="i-lucide-check-circle"
        empty-text="No alerts"
        name-key="title"
        delete-title="Delete Alerts"
        :delete-single-message="deleteSingleMessage"
        :delete-bulk-message="deleteBulkMessage"
        hide-delete-btn
      />
    </template>
  </UDashboardPanel>
</template>
