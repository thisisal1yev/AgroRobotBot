<script setup lang="ts">
const props = defineProps<{
  season?: {
    id: number;
    name: string;
    year: number;
    cropType: string;
    status: string;
    startDate: string;
    endDate?: string | null;
    farmId: number;
  } | null;
}>();

const open = defineModel<boolean>("open", { default: false });
const emit = defineEmits<{ saved: [] }>();

const toast = useToast();
const loading = ref(false);

const isEditing = computed(() => !!props.season);

const { data: farms } = useFetch("/api/farms", {
  server: false,
  lazy: true,
  default: () => [],
});

interface FarmOption { id: number; name: string }
const farmOptions = computed(() =>
  (farms.value || []).map((f: FarmOption) => ({ label: f.name, value: f.id })),
);

const statusOptions = [
  { label: "Planned", value: "PLANNED" },
  { label: "Active", value: "ACTIVE" },
  { label: "Completed", value: "COMPLETED" },
];

const formState = reactive({
  name: "",
  year: new Date().getFullYear(),
  cropType: "",
  status: "PLANNED",
  startDate: "",
  endDate: "",
  farmId: undefined as number | undefined,
});

function toDateInput(date: string | undefined | null): string {
  if (!date) return "";
  const [datePart = ""] = new Date(date).toISOString().split("T");
  return datePart;
}

watch(open, (val) => {
  if (val) {
    formState.name = props.season?.name || "";
    formState.year = props.season?.year || new Date().getFullYear();
    formState.cropType = props.season?.cropType || "";
    formState.status = props.season?.status || "PLANNED";
    formState.startDate = toDateInput(props.season?.startDate);
    formState.endDate = toDateInput(props.season?.endDate);
    formState.farmId = props.season?.farmId ?? undefined;
  }
});

async function handleSubmit() {
  loading.value = true;
  try {
    const body = { ...formState };

    if (isEditing.value) {
      await $fetch(`/api/seasons/${props.season!.id}`, { method: "PUT", body });
    } else {
      await $fetch("/api/seasons", { method: "POST", body });
    }

    toast.add({
      title: `Season ${isEditing.value ? "updated" : "created"} successfully`,
      color: "success",
    });
    open.value = false;
    emit("saved");
  } catch (err: unknown) {
    const msg = err && typeof err === "object" && "data" in err && err.data && typeof err.data === "object" && "message" in err.data ? String(err.data.message) : "Something went wrong";
    toast.add({
      title: msg,
      color: "error",
    });
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <FormSlideover
    v-model:open="open"
    :title="isEditing ? 'Edit Season' : 'Create Season'"
  >
    <div class="flex flex-col h-full">
      <UForm
        :state="formState"
        class="space-y-4 flex-1 overflow-y-auto"
        @submit="handleSubmit"
      >
        <UFormField label="Name" name="name" required>
          <UInput
            v-model="formState.name"
            placeholder="Season name"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Year" name="year">
          <UInput
            v-model.number="formState.year"
            type="number"
            placeholder="2026"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Crop Type" name="cropType">
          <UInput
            v-model="formState.cropType"
            placeholder="e.g. Wheat, Corn"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Status" name="status">
          <USelect
            v-model="formState.status"
            :items="statusOptions"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Start Date" name="startDate">
          <UInput v-model="formState.startDate" type="date" class="w-full" />
        </UFormField>

        <UFormField label="End Date" name="endDate">
          <UInput v-model="formState.endDate" type="date" class="w-full" />
        </UFormField>

        <UFormField label="Farm" name="farmId" required>
          <USelect
            v-model="formState.farmId"
            :items="farmOptions"
            placeholder="Select farm"
            class="w-full"
          />
        </UFormField>
      </UForm>

      <div class="pt-4">
        <UButton
          type="submit"
          :label="isEditing ? 'Update' : 'Create'"
          :loading="loading"
          class="w-full"
          block
          @click="handleSubmit"
        />
      </div>
    </div>
  </FormSlideover>
</template>
