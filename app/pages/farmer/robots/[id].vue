<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";

definePageMeta({
  layout: "farmer",
  middleware: ["auth"],
});

const route = useRoute();
const robotId = route.params.id as string;

const { data: robot, status } = await useFetch(`/api/robots/${robotId}`, {
  server: false,
});

type Mission = NonNullable<typeof robot.value>["missions"][number];

const missionColumns: TableColumn<Mission>[] = [
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) =>
      h(resolveComponent("UBadge"), {
        color: row.original.status === "COMPLETED" ? "success" : "warning",
        variant: "subtle",
        label: row.original.status,
      }),
  },
  {
    id: "field",
    header: "Field",
    cell: ({ row }) => row.original.field?.name ?? "—",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => formatDate(row.original.createdAt),
  },
];
</script>

<template>
  <UDashboardPanel id="farmer-robot-detail">
    <template #header>
      <UDashboardNavbar :title="robot?.name || 'Robot'">
        <template #leading>
          <UDashboardSidebarCollapse />
          <UButton
            icon="i-lucide-arrow-left"
            color="neutral"
            variant="ghost"
            to="/farmer/robots"
            class="mr-2"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div v-if="status === 'pending'" class="flex justify-center py-12">
        <UIcon name="i-lucide-loader-circle" class="size-8 animate-spin text-muted" />
      </div>

      <div v-else-if="!robot" class="text-center py-12">
        <UIcon name="i-lucide-bot" class="size-12 text-muted mx-auto mb-2" />
        <p class="text-sm text-muted">Robot not found</p>
      </div>

      <div v-else class="space-y-6">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Farm"
            :value="robot.farm?.name || 'Unknown'"
            icon="i-lucide-tractor"
            color="text-blue-500"
            bg="bg-blue-500/10"
          />
          <StatCard
            label="Serial"
            :value="robot.serialNumber"
            icon="i-lucide-barcode"
            color="text-green-500"
            bg="bg-green-500/10"
          />
          <StatCard
            label="Status"
            :value="robot.status"
            icon="i-lucide-activity"
            color="text-amber-500"
            bg="bg-amber-500/10"
          />
          <StatCard
            label="Battery"
            :value="`${robot.batteryLevel}%`"
            icon="i-lucide-battery"
            color="text-primary"
            bg="bg-primary/10"
          />
        </div>

        <UCard v-if="robot.firmwareVersion">
          <div class="flex items-center gap-3">
            <UIcon name="i-lucide-cpu" class="size-5 text-muted" />
            <span class="text-sm text-muted">Firmware</span>
            <span class="font-medium text-highlighted">{{ robot.firmwareVersion }}</span>
          </div>
        </UCard>

        <UCard>
          <template #header>
            <h4 class="font-semibold">Recent Missions</h4>
          </template>
          <DataTable
            :data="robot.missions ?? []"
            :columns="missionColumns"
            :searchable="false"
            empty-icon="i-lucide-map-pin"
            empty-text="No missions yet"
            hide-delete-btn
          />
        </UCard>
      </div>
    </template>
  </UDashboardPanel>
</template>
