<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

definePageMeta({
  layout: "farmer",
  middleware: ["auth"],
});

const { data: robots, status, refresh } = await useFetch("/api/robots", {
  server: false,
});

type Robot = NonNullable<typeof robots.value>[number]

const slideoverOpen = ref(false)
const editingRobot = ref<Robot | null>(null)

function openCreate() {
  editingRobot.value = null
  slideoverOpen.value = true
}

function openEdit(robot: Robot) {
  editingRobot.value = robot
  slideoverOpen.value = true
}

async function handleDelete(ids: (number | string)[]) {
  for (const id of ids) {
    await $fetch(`/api/robots/${id}`, { method: 'DELETE' })
  }
  await refresh()
}

function handleSaved() {
  refresh()
}

function viewRobot(r: Robot) {
  navigateTo(`/farmer/robots/${r.id}`)
}

const deleteSingleMessage = (r: Robot) => `Are you sure you want to delete "${r.name}"?`
const deleteBulkMessage = (n: number) => `Are you sure you want to delete ${n} robots?`

const columns: TableColumn<Robot>[] = [
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
    accessorKey: 'serialNumber',
    header: 'Serial Number',
  },
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
  {
    id: 'missions',
    header: 'Missions',
    cell: ({ row }) => row.original._count.missions
  },
]
</script>

<template>
  <UDashboardPanel id="farmer-robots">
    <template #header>
      <UDashboardNavbar title="Robots">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #right>
          <UButton label="Create Robot" icon="i-lucide-plus" @click="openCreate" />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <DataTable
        :data="robots ?? []"
        :columns="columns"
        :loading="status === 'pending'"
        search-key="name"
        search-placeholder="Search robots..."
        empty-icon="i-lucide-bot"
        empty-text="No robots assigned to your farms"
        delete-title="Delete Robots"
        :delete-single-message="deleteSingleMessage"
        :delete-bulk-message="deleteBulkMessage"
        show-edit-action
        @row-click="viewRobot"
        @edit="openEdit"
        @delete="handleDelete"
      />
      <RobotFormSlideover v-model:open="slideoverOpen" :robot="editingRobot" @saved="handleSaved" />
    </template>
  </UDashboardPanel>
</template>
