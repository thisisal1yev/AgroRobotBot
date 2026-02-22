<script setup lang="ts">
const props = defineProps<{
  farm?: {
    id: number;
    name: string;
    location: string;
    area: number;
    soilType: string;
    ownerId?: number;
  } | null;
}>();

const open = defineModel<boolean>("open", { default: false });
const emit = defineEmits<{ saved: [] }>();

const toast = useToast();
const { user } = useUserSession();
const loading = ref(false);

const isEditing = computed(() => !!props.farm);
const isAdmin = computed(() => user.value?.role === "ADMIN");

const { data: users, refresh: refreshUsers } = useFetch("/api/admin/users", {
  server: false,
  lazy: true,
  immediate: false,
  default: () => [],
});

interface UserOption {
  id: number;
  name: string | null;
  email: string;
}
const userOptions = computed(() =>
  (users.value || []).map((u: UserOption) => ({
    label: u.name || u.email,
    value: u.id,
  })),
);

const soilTypeOptions = [
  { label: "Clay", value: "CLAY" },
  { label: "Sandy", value: "SANDY" },
  { label: "Loam", value: "LOAM" },
  { label: "Silt", value: "SILT" },
  { label: "Peat", value: "PEAT" },
  { label: "Chalky", value: "CHALKY" },
];

const formState = reactive({
  name: "",
  location: "",
  area: 0,
  soilType: "LOAM",
  ownerId: undefined as number | undefined,
});

watch(open, async (val) => {
  if (val) {
    formState.name = props.farm?.name || "";
    formState.location = props.farm?.location || "";
    formState.area = props.farm?.area || 0;
    formState.soilType = props.farm?.soilType || "LOAM";
    formState.ownerId = props.farm?.ownerId ?? undefined;

    if (isAdmin.value) {
      refreshUsers();
    }
  }
});

async function handleSubmit() {
  loading.value = true;
  try {
    const body: Record<string, unknown> = {
      name: formState.name,
      location: formState.location,
      area: formState.area,
      soilType: formState.soilType,
    };
    if (isAdmin.value && formState.ownerId != null) {
      body.ownerId = formState.ownerId;
    }

    if (isEditing.value) {
      await $fetch(`/api/farms/${props.farm!.id}`, { method: "PUT", body });
    } else {
      await $fetch("/api/farms", { method: "POST", body });
    }

    toast.add({
      title: `Farm ${isEditing.value ? "updated" : "created"} successfully`,
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
    :title="isEditing ? 'Edit Farm' : 'Create Farm'"
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
            placeholder="Farm name"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Location" name="location">
          <UInput
            v-model="formState.location"
            placeholder="Location"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Area (ha)" name="area">
          <UInput
            v-model.number="formState.area"
            type="number"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Soil Type" name="soilType">
          <USelect
            v-model="formState.soilType"
            :items="soilTypeOptions"
            class="w-full"
          />
        </UFormField>

        <UFormField v-if="isAdmin" label="Owner" name="ownerId">
          <USelect
            v-model="formState.ownerId"
            :items="userOptions"
            placeholder="Select owner"
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
