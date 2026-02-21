<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

definePageMeta({
  layout: "farmer",
  middleware: ["auth"],
});

const { data: analyses, status } = await useFetch("/api/plant-analyses", {
  server: false,
});

type Analysis = NonNullable<typeof analyses.value>[number]

const deleteSingleMessage = (a: Analysis) => `Are you sure you want to delete this analysis?`
const deleteBulkMessage = (n: number) => `Are you sure you want to delete ${n} analyses?`

const columns: TableColumn<Analysis>[] = [
  {
    id: 'result',
    header: 'Result',
    accessorFn: (row) => row.healthy ? 'Healthy' : (row.disease || 'Disease detected'),
    cell: ({ row }) => h(resolveComponent('UBadge'), {
      color: row.original.healthy ? 'success' : 'error',
      variant: 'subtle',
      label: row.original.healthy ? 'Healthy' : (row.original.disease || 'Disease detected')
    })
  },
  {
    id: 'field',
    header: 'Field',
    cell: ({ row }) => row.original.field?.name || '\u2014'
  },
  {
    id: 'farm',
    header: 'Farm',
    cell: ({ row }) => row.original.field?.farm?.name || '\u2014'
  },
  {
    accessorKey: 'confidence',
    header: 'Confidence',
    cell: ({ row }) => `${Math.round(row.original.confidence * 100)}%`
  },
  {
    accessorKey: 'createdAt',
    header: 'Date',
    cell: ({ row }) => formatDate(row.original.createdAt)
  },
]
</script>

<template>
  <UDashboardPanel id="farmer-predictions">
    <template #header>
      <UDashboardNavbar title="Predictions">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <DataTable
        :data="analyses ?? []"
        :columns="columns"
        :loading="status === 'pending'"
        :searchable="false"
        empty-icon="i-lucide-brain"
        empty-text="No plant analyses yet"
        delete-title="Delete Analyses"
        :delete-single-message="deleteSingleMessage"
        :delete-bulk-message="deleteBulkMessage"
        hide-delete-btn
      />
    </template>
  </UDashboardPanel>
</template>
