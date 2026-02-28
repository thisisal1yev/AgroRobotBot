<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

definePageMeta({
  layout: "admin",
  middleware: ["auth"],
});

const route = useRoute()
const userId = route.params.id as string

const { data: user, status } = await useFetch(`/api/admin/users/${userId}`, {
  server: false,
})

type Farm = {
  id: number;
  name: string;
  location: string;
  area: number;
  soilType: string;
  createdAt: string;
  _count: { fields: number; robots: number };
}

type Report = {
  id: number;
  title: string;
  type: string;
  fileUrl: string | null;
  generatedAt: string;
}

const farmColumns: TableColumn<Farm>[] = [
  { accessorKey: 'name', header: 'Name' },
  {
    accessorKey: 'location',
    header: 'Location',
    cell: ({ row }) => row.original.location || 'N/A'
  },
  {
    accessorKey: 'area',
    header: 'Area',
    cell: ({ row }) => `${row.original.area} ha`
  },
  { accessorKey: 'soilType', header: 'Soil Type' },
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

const reportColumns: TableColumn<Report>[] = [
  { accessorKey: 'title', header: 'Title' },
  { accessorKey: 'type', header: 'Type' },
  {
    accessorKey: 'generatedAt',
    header: 'Date',
    cell: ({ row }) => formatDate(row.original.generatedAt)
  },
  {
    id: 'download',
    header: '',
    cell: ({ row }) => row.original.fileUrl
      ? h(resolveComponent('UButton'), {
          to: row.original.fileUrl,
          target: '_blank',
          icon: 'i-lucide-download',
          size: 'xs',
          variant: 'ghost',
          color: 'neutral'
        })
      : null
  },
]
</script>

<template>
  <UDashboardPanel id="admin-user-detail">
    <template #header>
      <UDashboardNavbar :title="user?.name || user?.email || 'User'">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div v-if="status === 'pending'" class="flex justify-center py-12">
        <UIcon name="i-lucide-loader-circle" class="size-8 animate-spin text-muted" />
      </div>

      <div v-else-if="!user" class="text-center py-12">
        <UIcon name="i-lucide-user-x" class="size-12 text-muted mx-auto mb-2" />
        <p class="text-sm text-muted">User not found</p>
      </div>

      <div v-else class="space-y-6">
        <!-- User Info -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Email"
            :value="user.email"
            icon="i-lucide-mail"
            color="text-blue-500"
            bg="bg-blue-500/10"
          />
          <StatCard
            label="Role"
            :value="user.role"
            icon="i-lucide-shield"
            :color="user.role === 'ADMIN' ? 'text-red-500' : 'text-green-500'"
            :bg="user.role === 'ADMIN' ? 'bg-red-500/10' : 'bg-green-500/10'"
          />
          <StatCard
            label="Farms"
            :value="user._count?.farms ?? 0"
            icon="i-lucide-tractor"
            color="text-amber-500"
            bg="bg-amber-500/10"
          />
          <StatCard
            label="Joined"
            :value="formatDate(user.createdAt)"
            icon="i-lucide-calendar"
            color="text-primary"
            bg="bg-primary/10"
          />
        </div>

        <!-- Farms Table -->
        <UCard>
          <template #header>
            <h4 class="font-semibold">Farms</h4>
          </template>
          <DataTable
            :data="user.farms ?? []"
            :columns="farmColumns"
            :searchable="false"
            empty-icon="i-lucide-tractor"
            empty-text="No farms"
            hide-delete-btn
          />
        </UCard>

        <!-- Reports Table -->
        <UCard>
          <template #header>
            <h4 class="font-semibold">Recent Reports</h4>
          </template>
          <DataTable
            :data="user.reports ?? []"
            :columns="reportColumns"
            :searchable="false"
            name-key="title"
            empty-icon="i-lucide-bar-chart-3"
            empty-text="No reports"
            hide-delete-btn
          />
        </UCard>
      </div>
    </template>
  </UDashboardPanel>
</template>
