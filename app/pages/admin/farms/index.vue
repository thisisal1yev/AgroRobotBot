<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

definePageMeta({
  layout: "admin",
  middleware: ["auth"],
});

const { data: farms, status } = await useFetch("/api/farms", {
  server: false,
});

type Farm = NonNullable<typeof farms.value>[number]

function viewFarm(farm: Farm) {
  navigateTo(`/admin/farms/${farm.id}`)
}

const deleteSingleMessage = (f: Farm) => `Are you sure you want to delete "${f.name}"?`
const deleteBulkMessage = (n: number) => `Are you sure you want to delete ${n} farms?`

const columns: TableColumn<Farm>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'location',
    header: 'Location',
    cell: ({ row }) => row.original.location || 'No location'
  },
  {
    id: 'owner',
    header: 'Owner',
    cell: ({ row }) => row.original.owner?.name || 'Unknown'
  },
  {
    accessorKey: 'area',
    header: 'Area',
    cell: ({ row }) => `${row.original.area} ha`
  },
  {
    accessorKey: 'soilType',
    header: 'Soil Type',
  },
  {
    id: 'fields',
    header: 'Fields',
    cell: ({ row }) => row.original._count.fields
  },
  {
    id: 'robots',
    header: 'Robots',
    cell: ({ row }) => row.original._count.robots
  },
]
</script>

<template>
  <UDashboardPanel id="admin-farms">
    <template #header>
      <UDashboardNavbar title="Farms">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <DataTable
        :data="farms ?? []"
        :columns="columns"
        :loading="status === 'pending'"
        search-key="name"
        search-placeholder="Search farms..."
        empty-icon="i-lucide-tractor"
        empty-text="No farms found"
        delete-title="Delete Farms"
        :delete-single-message="deleteSingleMessage"
        :delete-bulk-message="deleteBulkMessage"
        hide-delete-btn
        @row-click="viewFarm"
      />
    </template>
  </UDashboardPanel>
</template>
