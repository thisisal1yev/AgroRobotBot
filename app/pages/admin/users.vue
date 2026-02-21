<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

definePageMeta({
  layout: "admin",
  middleware: ["auth"],
});

const { data: users, status } = await useFetch("/api/admin/users", {
  server: false,
});

type User = NonNullable<typeof users.value>[number]

const deleteSingleMessage = (u: User) => `Are you sure you want to delete "${u.name || u.email}"?`
const deleteBulkMessage = (n: number) => `Are you sure you want to delete ${n} users?`

const columns: TableColumn<User>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => row.original.name || 'Unnamed'
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => h(resolveComponent('UBadge'), {
      color: row.original.role === 'ADMIN' ? 'error' : 'success',
      variant: 'subtle',
      label: row.original.role
    })
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => formatDate(row.original.createdAt)
  },
  {
    id: 'farms',
    header: 'Farms',
    cell: ({ row }) => row.original._count.farms
  },
]
</script>

<template>
  <UDashboardPanel id="admin-users">
    <template #header>
      <UDashboardNavbar title="Users">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <DataTable
        :data="users ?? []"
        :columns="columns"
        :loading="status === 'pending'"
        search-key="name"
        search-placeholder="Search users..."
        empty-icon="i-lucide-user-x"
        empty-text="No users found"
        delete-title="Delete Users"
        :delete-single-message="deleteSingleMessage"
        :delete-bulk-message="deleteBulkMessage"
        hide-delete-btn
      />
    </template>
  </UDashboardPanel>
</template>
