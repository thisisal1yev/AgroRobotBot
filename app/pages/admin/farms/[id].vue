<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

definePageMeta({
  layout: "admin",
  middleware: ["auth"],
});

const route = useRoute()
const farmId = route.params.id as string

const { data: farm, status } = await useFetch(`/api/farms/${farmId}`, {
  server: false,
})

type Farm = NonNullable<typeof farm.value>
type Field = Farm['fields'][number]
type Robot = Farm['robots'][number]
type Season = Farm['seasons'][number]

const fieldColumns: TableColumn<Field>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'cropType', header: 'Crop Type' },
  {
    accessorKey: 'area',
    header: 'Area',
    cell: ({ row }) => `${row.original.area} ha`
  },
]

const robotColumns: TableColumn<Robot>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'serialNumber', header: 'Serial Number' },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => h(resolveComponent('UBadge'), {
      color: robotStatusColor(row.original.status),
      variant: 'subtle',
      label: row.original.status
    })
  },
  {
    accessorKey: 'batteryLevel',
    header: 'Battery',
    cell: ({ row }) => `${row.original.batteryLevel}%`
  },
]

const seasonColumns: TableColumn<Season>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'cropType', header: 'Crop Type' },
  { accessorKey: 'year', header: 'Year' },
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
  <UDashboardPanel id="admin-farm-detail">
    <template #header>
      <UDashboardNavbar :title="farm?.name || 'Farm'">
        <template #leading>
          <UDashboardSidebarCollapse />
          <UButton
            icon="i-lucide-arrow-left"
            color="neutral"
            variant="ghost"
            to="/admin/farms"
            class="mr-2"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div v-if="status === 'pending'" class="flex justify-center py-12">
        <UIcon name="i-lucide-loader-circle" class="size-8 animate-spin text-muted" />
      </div>

      <div v-else-if="!farm" class="text-center py-12">
        <UIcon name="i-lucide-tractor" class="size-12 text-muted mx-auto mb-2" />
        <p class="text-sm text-muted">Farm not found</p>
      </div>

      <div v-else class="space-y-6">
        <!-- Farm Info -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Location"
            :value="farm.location || 'N/A'"
            icon="i-lucide-map-pin"
            color="text-blue-500"
            bg="bg-blue-500/10"
          />
          <StatCard
            label="Area"
            :value="`${farm.area} ha`"
            icon="i-lucide-ruler"
            color="text-green-500"
            bg="bg-green-500/10"
          />
          <StatCard
            label="Soil Type"
            :value="farm.soilType"
            icon="i-lucide-mountain"
            color="text-amber-500"
            bg="bg-amber-500/10"
          />
          <StatCard
            label="Owner"
            :value="farm.owner?.name || 'Unknown'"
            icon="i-lucide-user"
            color="text-primary"
            bg="bg-primary/10"
          />
        </div>

        <!-- Counts -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <UCard>
            <div class="flex items-center gap-3">
              <UIcon name="i-lucide-map" class="size-5 text-blue-500" />
              <div>
                <p class="text-sm text-muted">Fields</p>
                <p class="text-xl font-bold text-highlighted">{{ farm._count.fields }}</p>
              </div>
            </div>
          </UCard>
          <UCard>
            <div class="flex items-center gap-3">
              <UIcon name="i-lucide-bot" class="size-5 text-purple-500" />
              <div>
                <p class="text-sm text-muted">Robots</p>
                <p class="text-xl font-bold text-highlighted">{{ farm._count.robots }}</p>
              </div>
            </div>
          </UCard>
          <UCard>
            <div class="flex items-center gap-3">
              <UIcon name="i-lucide-file-text" class="size-5 text-emerald-500" />
              <div>
                <p class="text-sm text-muted">Reports</p>
                <p class="text-xl font-bold text-highlighted">{{ farm._count.reports }}</p>
              </div>
            </div>
          </UCard>
        </div>

        <!-- Fields Table -->
        <UCard>
          <template #header>
            <h4 class="font-semibold">Fields</h4>
          </template>
          <DataTable
            :data="farm.fields"
            :columns="fieldColumns"
            :searchable="false"
            empty-icon="i-lucide-map"
            empty-text="No fields in this farm"
            hide-delete-btn
          />
        </UCard>

        <!-- Robots Table -->
        <UCard>
          <template #header>
            <h4 class="font-semibold">Robots</h4>
          </template>
          <DataTable
            :data="farm.robots"
            :columns="robotColumns"
            :searchable="false"
            empty-icon="i-lucide-bot"
            empty-text="No robots assigned to this farm"
            hide-delete-btn
          />
        </UCard>

        <!-- Seasons Table -->
        <UCard>
          <template #header>
            <h4 class="font-semibold">Seasons</h4>
          </template>
          <DataTable
            :data="farm.seasons"
            :columns="seasonColumns"
            :searchable="false"
            empty-icon="i-lucide-calendar"
            empty-text="No seasons"
            hide-delete-btn
          />
        </UCard>
      </div>
    </template>
  </UDashboardPanel>
</template>
