<script setup lang="ts" generic="T extends { id: number | string; [key: string]: unknown }">
import type { TableColumn } from '@nuxt/ui'
import { upperFirst } from 'scule'
import { getPaginationRowModel } from '@tanstack/table-core'
import type { Row } from '@tanstack/table-core'

/** Ref type for UTable instance exposing tableApi (Nuxt UI DataTable) */
interface TableRefApi<T> {
  tableApi?: {
    getFilteredSelectedRowModel(): { rows: Row<T>[] }
    getColumn(key: string): { getFilterValue(): unknown; setFilterValue(v: unknown): void } | undefined
    resetRowSelection(): void
    getAllColumns(): Array<{ id: string; getCanHide(): boolean; getIsVisible(): boolean; toggleVisibility(v: boolean): void }>
    getFilteredRowModel(): { rows: unknown[] }
    getState(): { pagination: { pageIndex: number; pageSize: number } }
    setPageIndex(n: number): void
  }
}

const props = withDefaults(defineProps<{
  data: T[]
  columns: TableColumn<T>[]
  loading?: boolean
  searchable?: boolean
  searchPlaceholder?: string
  searchKey?: string
  emptyIcon?: string
  emptyText?: string
  deleteTitle?: string
  deleteSingleMessage?: (item: T) => string
  deleteBulkMessage?: (count: number) => string
  nameKey?: string
  hideDeleteBtn?: boolean
  showEditAction?: boolean
}>(), {
  loading: false,
  searchable: true,
  searchKey: 'name',
  emptyIcon: 'i-lucide-inbox',
  emptyText: 'No data found',
  searchPlaceholder: 'Search...',
  deleteTitle: 'Delete',
  deleteSingleMessage: undefined,
  deleteBulkMessage: undefined,
  nameKey: 'name',
  hideDeleteBtn: false,
  showEditAction: false
})

const emit = defineEmits<{
  'delete': [ids: (number | string)[]]
  'row-click': [item: T]
  'select': [items: T[]]
  'edit': [item: T]
}>()

const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const UCheckbox = resolveComponent('UCheckbox')

const toast = useToast()
const table = useTemplateRef<TableRefApi<T>>('table')

const columnFilters = ref([{ id: props.searchKey, value: '' }])
const columnVisibility = ref()
const rowSelection = ref({})
const pagination = ref({ pageIndex: 0, pageSize: 10 })

const openDeleteModal = ref(false)
const deleteLoading = ref(false)
const itemToDelete = ref<T | null>(null)

function getSelectedCount(): number {
  return table.value?.tableApi?.getFilteredSelectedRowModel().rows.length || 0
}

function getSelectedItems(): T[] {
  return table.value?.tableApi?.getFilteredSelectedRowModel().rows.map((r: Row<T>) => r.original) || []
}

const searchQuery = computed({
  get: (): string => (table.value?.tableApi?.getColumn(props.searchKey)?.getFilterValue() as string) || '',
  set: (value: string) => table.value?.tableApi?.getColumn(props.searchKey)?.setFilterValue(value || undefined)
})

const deleteMessage = computed(() => {
  if (itemToDelete.value) {
    return props.deleteSingleMessage?.(itemToDelete.value) || 'Are you sure you want to delete this item?'
  }
  return props.deleteBulkMessage?.(getSelectedCount()) || `Are you sure you want to delete ${getSelectedCount()} items?`
})

function openSingleDelete(item: T) {
  itemToDelete.value = item
  openDeleteModal.value = true
}

function openBulkDelete() {
  itemToDelete.value = null
  openDeleteModal.value = true
}

async function handleDelete() {
  deleteLoading.value = true
  try {
    const ids = itemToDelete.value
      ? [itemToDelete.value.id]
      : getSelectedItems().map(item => item.id)

    emit('delete', ids)

    if (!itemToDelete.value) {
      table.value?.tableApi?.resetRowSelection()
    }
    openDeleteModal.value = false
  } finally {
    deleteLoading.value = false
  }
}

watch(rowSelection, async () => {
  await nextTick()
  emit('select', getSelectedItems())
}, { deep: true })

const columnDisplayItems = computed(() => {
  const api = table.value?.tableApi;
  if (!api) return [];
  const cols = api.getAllColumns();
  return cols
    .filter((c: { getCanHide(): boolean }) => c.getCanHide())
    .map((c: { id: string; getIsVisible(): boolean; toggleVisibility(v: boolean): void }) => ({
      label: upperFirst(c.id),
      type: "checkbox" as const,
      checked: c.getIsVisible(),
      onUpdateChecked: (checked: boolean) => c.toggleVisibility(!!checked),
      onSelect: (e?: Event) => e?.preventDefault(),
    }));
});

const fullColumns = computed((): TableColumn<T>[] => {
  const cols: TableColumn<T>[] = [
    {
      id: 'select',
      header: ({ table }) =>
        h(UCheckbox, {
          'modelValue': table.getIsSomePageRowsSelected() ? 'indeterminate' : table.getIsAllPageRowsSelected(),
          'onUpdate:modelValue': (value: boolean | 'indeterminate') => table.toggleAllPageRowsSelected(!!value),
          'ariaLabel': 'Select all'
        }),
      cell: ({ row }) =>
        h(UCheckbox, {
          'modelValue': row.getIsSelected(),
          'onUpdate:modelValue': (value: boolean | 'indeterminate') => row.toggleSelected(!!value),
          'ariaLabel': 'Select row'
        })
    },
    ...props.columns,
    {
      id: 'actions',
      cell: ({ row }) => h('div', { class: 'text-right' },
        h(UDropdownMenu, {
          content: { align: 'end' },
          items: [
            { type: 'label', label: 'Actions' },
            {
              label: 'Copy name',
              icon: 'i-lucide-copy',
              onSelect: () => {
                navigator.clipboard.writeText(String((row.original as Record<string, unknown>)[props.nameKey] || ''))
                toast.add({ title: 'Copied to clipboard' })
              }
            },
            {
              label: 'View details',
              icon: 'i-lucide-eye',
              onSelect: () => emit('row-click', row.original)
            },
            ...(props.showEditAction ? [{
              label: 'Edit',
              icon: 'i-lucide-pencil',
              onSelect: () => emit('edit', row.original)
            }] : []),
            ...(!props.hideDeleteBtn ? [
              { type: 'separator' as const },
              {
                label: 'Delete',
                icon: 'i-lucide-trash',
                color: 'error' as const,
                onSelect: () => openSingleDelete(row.original)
              }
            ] : [])
          ]
        }, () => h(UButton, {
          icon: 'i-lucide-ellipsis-vertical',
          color: 'neutral',
          variant: 'ghost',
          class: 'ml-auto'
        }))
      )
    }
  ]
  return cols
})

defineExpose({
  getSelectedItems,
  getSelectedCount,
  resetSelection: () => table.value?.tableApi?.resetRowSelection()
})
</script>

<template>
  <div class="space-y-4">
    <div class="flex flex-wrap items-center justify-between gap-1.5">
      <UInput
        v-if="searchable"
        v-model="searchQuery"
        class="w-sm"
        icon="i-lucide-search"
        :placeholder="searchPlaceholder || 'Search...'"
      />
      <div v-else />

      <div class="flex flex-wrap items-center gap-1.5">
        <slot name="toolbar" />

        <UButton
          v-if="getSelectedCount() && !hideDeleteBtn"
          label="Delete"
          color="error"
          variant="subtle"
          icon="i-lucide-trash"
          @click="openBulkDelete"
        >
          <template #trailing>
            <UKbd color="error">
              {{ getSelectedCount() }}
            </UKbd>
          </template>
        </UButton>

        <UDropdownMenu
          :items="columnDisplayItems"
          :content="{ align: 'end' }"
        >
          <UButton label="Display" color="neutral" variant="outline" trailing-icon="i-lucide-settings-2" />
        </UDropdownMenu>
      </div>
    </div>

    <UTable
      ref="table"
      v-model:column-filters="columnFilters"
      v-model:column-visibility="columnVisibility"
      v-model:row-selection="rowSelection"
      v-model:pagination="pagination"
      :pagination-options="{ getPaginationRowModel: getPaginationRowModel() }"
      class="shrink-0"
      :data="data"
      :columns="fullColumns"
      :loading="loading"
      :ui="{
        base: 'table-fixed border-separate border-spacing-0',
        thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
        tbody: '[&>tr]:last:[&>td]:border-b-0',
        th: 'py-2 first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
        td: 'border-b border-default',
        separator: 'h-0'
      }"
    >
      <template #empty-state>
        <div class="flex flex-col items-center justify-center py-12">
          <UIcon :name="emptyIcon" class="w-12 h-12 text-muted mb-4" />
          <p class="text-muted">{{ emptyText }}</p>
        </div>
      </template>
    </UTable>

    <div class="flex items-center justify-between gap-3 border-t border-default pt-4">
      <div class="text-sm text-muted">
        {{ getSelectedCount() }} of {{ table?.tableApi?.getFilteredRowModel().rows.length || 0 }} row(s) selected.
      </div>

      <UPagination
        :default-page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
        :items-per-page="table?.tableApi?.getState().pagination.pageSize"
        :total="table?.tableApi?.getFilteredRowModel().rows.length"
        @update:page="(p: number) => table?.tableApi?.setPageIndex(p - 1)"
      />
    </div>

    <ConfirmModal
      v-model:open="openDeleteModal"
      :title="deleteTitle"
      :message="deleteMessage"
      confirm-text="Delete"
      confirm-color="error"
      :loading="deleteLoading"
      @confirm="handleDelete"
    />
  </div>
</template>
