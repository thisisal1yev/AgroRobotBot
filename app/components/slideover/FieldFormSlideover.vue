<script setup lang="ts">
const props = defineProps<{
  field?: {
    id: number;
    name: string;
    area: number;
    cropType: string;
    farmId: number;
    coordinates?: unknown;
  } | null;
}>();

const open = defineModel<boolean>("open", { default: false });
const emit = defineEmits<{ saved: [] }>();

const toast = useToast();
const loading = ref(false);

const isEditing = computed(() => !!props.field);

const { data: farms } = useFetch("/api/farms", {
  server: false,
  lazy: true,
  default: () => [],
});

interface FarmOption { id: number; name: string }
const farmOptions = computed(() =>
  (farms.value || []).map((f: FarmOption) => ({ label: f.name, value: f.id })),
);

const formState = reactive({
  name: "",
  area: 0,
  cropType: "",
  farmId: undefined as number | undefined,
  coordinates: "",
});

watch(open, (val) => {
  if (val) {
    formState.name = props.field?.name || "";
    formState.area = props.field?.area || 0;
    formState.cropType = props.field?.cropType || "";
    formState.farmId = props.field?.farmId ?? undefined;
    formState.coordinates = props.field?.coordinates
      ? JSON.stringify(props.field.coordinates)
      : "";
  }
});

async function handleSubmit() {
  loading.value = true;
  try {
    const body: Record<string, unknown> = {
      name: formState.name,
      area: formState.area,
      cropType: formState.cropType,
      farmId: formState.farmId!,
    };

    if (formState.coordinates) {
      try {
        body.coordinates = JSON.parse(formState.coordinates);
      } catch {
        toast.add({
          title: "Invalid JSON in coordinates field",
          color: "error",
        });
        loading.value = false;
        return;
      }
    }

    if (isEditing.value) {
      await $fetch(`/api/fields/${props.field!.id}`, { method: "PUT", body });
    } else {
      await $fetch("/api/fields", { method: "POST", body });
    }

    toast.add({
      title: `Field ${isEditing.value ? "updated" : "created"} successfully`,
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
    :title="isEditing ? 'Edit Field' : 'Create Field'"
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
            placeholder="Field name"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Area (ha)" name="area">
          <UInput
            v-model.number="formState.area"
            type="number"
            placeholder="0"
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

        <UFormField label="Farm" name="farmId" required>
          <USelect
            v-model="formState.farmId"
            :items="farmOptions"
            placeholder="Select farm"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Coordinates (JSON)" name="coordinates">
          <UTextarea
            v-model="formState.coordinates"
            placeholder='[{"lat": 0, "lng": 0}]'
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
