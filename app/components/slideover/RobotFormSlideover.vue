<script setup lang="ts">
const props = defineProps<{
  robot?: {
    id: string;
    name: string;
    serialNumber: string;
    status: string;
    batteryLevel: number;
    firmwareVersion: string;
    farmId: string;
  } | null;
}>();

const open = defineModel<boolean>("open", { default: false });
const emit = defineEmits<{ saved: [] }>();

const toast = useToast();
const loading = ref(false);

const isEditing = computed(() => !!props.robot);

const { data: farms } = useFetch("/api/farms", {
  server: false,
  lazy: true,
  default: () => [],
});

const farmOptions = computed(() =>
  (farms.value || []).map((f: any) => ({ label: f.name, value: f.id })),
);

const statusOptions = [
  { label: "Online", value: "ONLINE" },
  { label: "Offline", value: "OFFLINE" },
  { label: "Charging", value: "CHARGING" },
  { label: "In Mission", value: "IN_MISSION" },
];

const formState = reactive({
  name: "",
  serialNumber: "",
  status: "OFFLINE",
  batteryLevel: 100,
  firmwareVersion: "1.0.0",
  farmId: "",
});

watch(open, (val) => {
  if (val) {
    formState.name = props.robot?.name || "";
    formState.serialNumber = props.robot?.serialNumber || "";
    formState.status = props.robot?.status || "OFFLINE";
    formState.batteryLevel = props.robot?.batteryLevel ?? 100;
    formState.firmwareVersion = props.robot?.firmwareVersion || "1.0.0";
    formState.farmId = props.robot?.farmId || "";
  }
});

async function handleSubmit() {
  loading.value = true;
  try {
    const body = { ...formState };

    if (isEditing.value) {
      await $fetch(`/api/robots/${props.robot!.id}`, { method: "PUT", body });
    } else {
      await $fetch("/api/robots", { method: "POST", body });
    }

    toast.add({
      title: `Robot ${isEditing.value ? "updated" : "created"} successfully`,
      color: "success",
    });
    open.value = false;
    emit("saved");
  } catch (err: any) {
    toast.add({
      title: err.data?.message || "Something went wrong",
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
    :title="isEditing ? 'Edit Robot' : 'Create Robot'"
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
            placeholder="Robot name"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Serial Number" name="serialNumber" required>
          <UInput
            v-model="formState.serialNumber"
            placeholder="e.g. RBT-001"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Status" name="status">
          <USelect v-model="formState.status" :items="statusOptions" class="w-full" />
        </UFormField>

        <UFormField label="Battery Level (%)" name="batteryLevel">
          <UInput
            v-model.number="formState.batteryLevel"
            type="number"
            min="0"
            class="w-full"
            max="100"
          />
        </UFormField>

        <UFormField label="Firmware Version" name="firmwareVersion">
          <UInput
            v-model="formState.firmwareVersion"
            placeholder="1.0.0"
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
