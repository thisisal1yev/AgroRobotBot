<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

definePageMeta({
  layout: "admin",
  middleware: ["auth"],
});

const route = useRoute()
const fieldId = route.params.id as string

const { data: field, status } = await useFetch(`/api/fields/${fieldId}`, {
  server: false,
})

type Field = NonNullable<typeof field.value>
type Alert = Field['alerts'][number]
type Reading = Field['telemetryReadings'][number]
type Analysis = Field['plantAnalyses'][number]
type Recommendation = Field['recommendations'][number]

const alertColumns: TableColumn<Alert>[] = [
  { accessorKey: 'title', header: 'Title' },
  {
    accessorKey: 'severity',
    header: 'Severity',
    cell: ({ row }) => h(resolveComponent('UBadge'), {
      color: severityColor(row.original.severity),
      variant: 'subtle',
      label: row.original.severity
    })
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => h(resolveComponent('UBadge'), {
      color: row.original.status === 'ACTIVE' ? 'error' : 'success',
      variant: 'subtle',
      label: row.original.status
    })
  },
  {
    accessorKey: 'createdAt',
    header: 'Date',
    cell: ({ row }) => formatDate(row.original.createdAt)
  },
]

const readingColumns: TableColumn<Reading>[] = [
  {
    accessorKey: 'recordedAt',
    header: 'Recorded',
    cell: ({ row }) => formatDate(row.original.recordedAt)
  },
  { accessorKey: 'moisture', header: 'Moisture' },
  { accessorKey: 'ph', header: 'pH' },
  { accessorKey: 'temperature', header: 'Temp' },
  { accessorKey: 'humidity', header: 'Humidity' },
]

const analysisColumns: TableColumn<Analysis>[] = [
  {
    accessorKey: 'healthy',
    header: 'Status',
    cell: ({ row }) => h(resolveComponent('UBadge'), {
      color: row.original.healthy ? 'success' : 'error',
      variant: 'subtle',
      label: row.original.healthy ? 'Healthy' : 'Diseased'
    })
  },
  {
    accessorKey: 'disease',
    header: 'Disease',
    cell: ({ row }) => row.original.disease || '\u2014'
  },
  {
    accessorKey: 'confidence',
    header: 'Confidence',
    cell: ({ row }) => `${(row.original.confidence * 100).toFixed(1)}%`
  },
  {
    accessorKey: 'createdAt',
    header: 'Date',
    cell: ({ row }) => formatDate(row.original.createdAt)
  },
]

const recommendationColumns: TableColumn<Recommendation>[] = [
  { accessorKey: 'title', header: 'Title' },
  { accessorKey: 'category', header: 'Category' },
  { accessorKey: 'priority', header: 'Priority' },
  {
    accessorKey: 'applied',
    header: 'Applied',
    cell: ({ row }) => h(resolveComponent('UBadge'), {
      color: row.original.applied ? 'success' : 'neutral',
      variant: 'subtle',
      label: row.original.applied ? 'Yes' : 'No'
    })
  },
]
</script>

<template>
  <UDashboardPanel id="admin-field-detail">
    <template #header>
      <UDashboardNavbar :title="field?.name || 'Field'">
        <template #leading>
          <UDashboardSidebarCollapse />
          <UButton
            icon="i-lucide-arrow-left"
            color="neutral"
            variant="ghost"
            to="/admin/fields"
            class="mr-2"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div v-if="status === 'pending'" class="flex justify-center py-12">
        <UIcon name="i-lucide-loader-circle" class="size-8 animate-spin text-muted" />
      </div>

      <div v-else-if="!field" class="text-center py-12">
        <UIcon name="i-lucide-map" class="size-12 text-muted mx-auto mb-2" />
        <p class="text-sm text-muted">Field not found</p>
      </div>

      <div v-else class="space-y-6">
        <!-- Field Info -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Farm"
            :value="field.farm?.name || 'Unknown'"
            icon="i-lucide-tractor"
            color="text-blue-500"
            bg="bg-blue-500/10"
          />
          <StatCard
            label="Crop Type"
            :value="field.cropType || 'N/A'"
            icon="i-lucide-sprout"
            color="text-green-500"
            bg="bg-green-500/10"
          />
          <StatCard
            label="Area"
            :value="`${field.area} ha`"
            icon="i-lucide-ruler"
            color="text-amber-500"
            bg="bg-amber-500/10"
          />
          <StatCard
            label="Active Alerts"
            :value="field._count.alerts"
            icon="i-lucide-alert-triangle"
            color="text-red-500"
            bg="bg-red-500/10"
          />
        </div>

        <!-- Counts -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <UCard>
            <div class="flex items-center gap-3">
              <UIcon name="i-lucide-activity" class="size-5 text-blue-500" />
              <div>
                <p class="text-sm text-muted">Telemetry Readings</p>
                <p class="text-xl font-bold text-highlighted">{{ field._count.telemetryReadings }}</p>
              </div>
            </div>
          </UCard>
          <UCard>
            <div class="flex items-center gap-3">
              <UIcon name="i-lucide-lightbulb" class="size-5 text-amber-500" />
              <div>
                <p class="text-sm text-muted">Recommendations</p>
                <p class="text-xl font-bold text-highlighted">{{ field._count.recommendations }}</p>
              </div>
            </div>
          </UCard>
          <UCard>
            <div class="flex items-center gap-3">
              <UIcon name="i-lucide-rocket" class="size-5 text-purple-500" />
              <div>
                <p class="text-sm text-muted">Missions</p>
                <p class="text-xl font-bold text-highlighted">{{ field._count.missions }}</p>
              </div>
            </div>
          </UCard>
        </div>

        <!-- Alerts Table -->
        <UCard>
          <template #header>
            <h4 class="font-semibold">Recent Alerts</h4>
          </template>
          <DataTable
            :data="field.alerts"
            :columns="alertColumns"
            :searchable="false"
            name-key="title"
            empty-icon="i-lucide-alert-triangle"
            empty-text="No alerts"
            hide-delete-btn
          />
        </UCard>

        <!-- Telemetry Table -->
        <UCard>
          <template #header>
            <h4 class="font-semibold">Recent Telemetry</h4>
          </template>
          <DataTable
            :data="field.telemetryReadings"
            :columns="readingColumns"
            :searchable="false"
            empty-icon="i-lucide-activity"
            empty-text="No readings"
            hide-delete-btn
          />
        </UCard>

        <!-- Plant Analyses Table -->
        <UCard>
          <template #header>
            <h4 class="font-semibold">Recent Plant Analyses</h4>
          </template>
          <DataTable
            :data="field.plantAnalyses"
            :columns="analysisColumns"
            :searchable="false"
            empty-icon="i-lucide-scan-eye"
            empty-text="No analyses"
            hide-delete-btn
          />
        </UCard>

        <!-- Recommendations Table -->
        <UCard>
          <template #header>
            <h4 class="font-semibold">Recommendations</h4>
          </template>
          <DataTable
            :data="field.recommendations"
            :columns="recommendationColumns"
            :searchable="false"
            name-key="title"
            empty-icon="i-lucide-lightbulb"
            empty-text="No recommendations"
            hide-delete-btn
          />
        </UCard>
      </div>
    </template>
  </UDashboardPanel>
</template>
