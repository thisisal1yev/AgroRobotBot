<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

definePageMeta({
  layout: "farmer",
  middleware: ["auth"],
});

const { data: fields, status } = await useFetch("/api/fields", {
  server: false,
});

type Field = NonNullable<typeof fields.value>[number]

const deleteSingleMessage = (f: Field) => `Are you sure you want to delete "${f.name}"?`
const deleteBulkMessage = (n: number) => `Are you sure you want to delete ${n} fields?`

const columns: TableColumn<Field>[] = [
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
    accessorKey: 'area',
    header: 'Area',
    cell: ({ row }) => `${row.original.area} ha`
  },
  {
    id: 'alerts',
    header: 'Alerts',
    cell: ({ row }) => h(resolveComponent('UBadge'), {
      color: row.original._count.alerts ? 'error' : 'neutral',
      variant: 'subtle',
      size: 'xs',
      label: String(row.original._count.alerts)
    })
  },
  {
    id: 'readings',
    header: 'Readings',
    cell: ({ row }) => row.original._count.telemetryReadings
  },
]
</script>

<template>
  <UDashboardPanel id="farmer-fields">
    <template #header>
      <UDashboardNavbar title="Fields">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <DataTable
        :data="fields ?? []"
        :columns="columns"
        :loading="status === 'pending'"
        search-key="name"
        search-placeholder="Search fields..."
        empty-icon="i-lucide-map"
        empty-text="No fields yet"
        delete-title="Delete Fields"
        :delete-single-message="deleteSingleMessage"
        :delete-bulk-message="deleteBulkMessage"
        hide-delete-btn
      />
    </template>
  </UDashboardPanel>
</template>
