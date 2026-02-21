<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

definePageMeta({
  layout: "farmer",
  middleware: ["auth"],
});

const { data: seasons, status } = await useFetch("/api/seasons", {
  server: false,
});

type Season = NonNullable<typeof seasons.value>[number]

const deleteSingleMessage = (s: Season) => `Are you sure you want to delete "${s.name}"?`
const deleteBulkMessage = (n: number) => `Are you sure you want to delete ${n} seasons?`

const columns: TableColumn<Season>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    id: 'farm',
    header: 'Farm',
    cell: ({ row }) => row.original.farm?.name || '\u2014'
  },
  {
    accessorKey: 'cropType',
    header: 'Crop Type',
  },
  {
    accessorKey: 'year',
    header: 'Year',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => h(resolveComponent('UBadge'), {
      color: seasonStatusColor(row.original.status),
      variant: 'subtle',
      label: row.original.status
    })
  },
  {
    accessorKey: 'startDate',
    header: 'Start Date',
    cell: ({ row }) => formatDate(row.original.startDate)
  },
]
</script>

<template>
  <UDashboardPanel id="farmer-seasons">
    <template #header>
      <UDashboardNavbar title="Seasons">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <DataTable
        :data="seasons ?? []"
        :columns="columns"
        :loading="status === 'pending'"
        search-key="name"
        search-placeholder="Search seasons..."
        empty-icon="i-lucide-calendar"
        empty-text="No seasons yet"
        delete-title="Delete Seasons"
        :delete-single-message="deleteSingleMessage"
        :delete-bulk-message="deleteBulkMessage"
        hide-delete-btn
      />
    </template>
  </UDashboardPanel>
</template>
