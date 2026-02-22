<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

definePageMeta({
  layout: "farmer",
  middleware: ["auth"],
});

const { data: fields, status, refresh } = await useFetch("/api/fields", {
  server: false,
});

type Field = NonNullable<typeof fields.value>[number]

const slideoverOpen = ref(false)
const editingField = ref<Field | null>(null)

function openCreate() {
  editingField.value = null
  slideoverOpen.value = true
}

function openEdit(field: Field) {
  editingField.value = field
  slideoverOpen.value = true
}

async function handleDelete(ids: (number | string)[]) {
  for (const id of ids) {
    await $fetch(`/api/fields/${id}`, { method: 'DELETE' })
  }
  await refresh()
}

function handleSaved() {
  refresh()
}

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
        <template #right>
          <UButton label="Create Field" icon="i-lucide-plus" @click="openCreate" />
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
        show-edit-action
        @edit="openEdit"
        @delete="handleDelete"
      />
      <FieldFormSlideover v-model:open="slideoverOpen" :field="editingField" @saved="handleSaved" />
    </template>
  </UDashboardPanel>
</template>
