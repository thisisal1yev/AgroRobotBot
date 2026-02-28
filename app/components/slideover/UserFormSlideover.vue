<script setup lang="ts">
import { Role, getRoleLabel, type UserRole } from "~/constants/roles";

const props = defineProps<{
  user?: {
    id: number;
    name: string | null;
    email: string;
    role: string;
  } | null;
}>();

const open = defineModel<boolean>("open", { default: false });
const emit = defineEmits<{ saved: [] }>();

const toast = useToast();
const loading = ref(false);

const isEditing = computed(() => !!props.user);

const formState = reactive({
  name: "",
  email: "",
  password: "",
  role: Role.FARMER as UserRole,
});

const roleOptions = [
  { label: getRoleLabel(Role.FARMER), value: Role.FARMER },
  { label: getRoleLabel(Role.ADMIN), value: Role.ADMIN },
];

watch(open, (val) => {
  if (val) {
    formState.name = props.user?.name || "";
    formState.email = props.user?.email || "";
    formState.password = "";
    formState.role = (props.user?.role as UserRole) || Role.FARMER;
  }
});

async function handleSubmit() {
  loading.value = true;
  try {
    if (isEditing.value) {
      // For edit, only send non-empty password if user wants to change it
      const { password, ...data } = formState;
      await $fetch(`/api/admin/users/${props.user!.id}`, {
        method: "PUT",
        body: password ? { ...data, password } : data,
      });
    } else {
      // For create, password is required
      await $fetch("/api/admin/users", {
        method: "POST",
        body: formState,
      });
    }

    toast.add({
      title: `User ${isEditing.value ? "updated" : "created"} successfully`,
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
    :title="isEditing ? 'Edit User' : 'Create User'"
  >
    <div class="flex flex-col h-full">
      <UForm
        :state="formState"
        class="space-y-4 flex-1 overflow-y-auto"
        @submit="handleSubmit"
      >
        <UFormField label="Name" name="name">
          <UInput
            v-model="formState.name"
            placeholder="Full name"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Email" name="email" required>
          <UInput
            v-model="formState.email"
            type="email"
            placeholder="Email address"
            class="w-full"
          />
        </UFormField>

        <UFormField v-if="!isEditing" label="Password" name="password" required>
          <UInput
            v-model="formState.password"
            type="password"
            placeholder="Min 6 characters"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Role" name="role">
          <USelect
            v-model="formState.role"
            :items="roleOptions"
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
