<script setup lang="ts">
import type {
  AuthFormField,
  TabsItem,
  FormSubmitEvent,
  ButtonProps,
} from "@nuxt/ui";

definePageMeta({
  layout: "auth",
});

const toast = useToast();
const { loggedIn, user, fetch: fetchSession } = useUserSession();

const activeTab = ref<"login" | "register">("login");
const isLoading = ref(false);
const error = ref<string | null>(null);

watchEffect(() => {
  if (loggedIn.value && user.value) {
    const base = user.value.role === "ADMIN" ? "/admin" : "/farmer";
    navigateTo(base);
  }
});

const tabs = computed<TabsItem[]>(() => [
  { label: "Sign in", value: "login", icon: "i-lucide-log-in" },
  { label: "Create account", value: "register", icon: "i-lucide-user-plus" },
]);

const loginFields = computed<AuthFormField[]>(() => [
  {
    name: "email",
    type: "email",
    label: "Email",
    placeholder: "you@example.com",
    required: true,
  },
  {
    name: "password",
    type: "password",
    label: "Password",
    placeholder: "••••••••",
    required: true,
  },
  {
    name: "remember",
    type: "checkbox",
    label: "Remember me",
  },
]);

const registerFields = computed<AuthFormField[]>(() => [
  {
    name: "name",
    type: "text",
    label: "Full name",
    placeholder: "John Doe",
    required: true,
  },
  {
    name: "email",
    type: "email",
    label: "Email",
    placeholder: "you@example.com",
    required: true,
  },
  {
    name: "password",
    type: "password",
    label: "Password",
    placeholder: "Create a strong password",
    required: true,
  },
]);

const providers = computed((): ButtonProps[] => [
  {
    label: "Google",
    icon: "i-simple-icons-google",
    color: "neutral",
    variant: "subtle",
    onClick: () =>
      toast.add({
        title: "Coming soon",
        description: "Google auth is not enabled yet.",
      }),
  },
  {
    label: "GitHub",
    icon: "i-simple-icons-github",
    color: "neutral",
    variant: "subtle",
    onClick: () => {
      toast.add({
        title: "Coming soon",
        description: "GitHub auth is not enabled yet.",
      });
    },
  },
]);

type LoginPayload = { email: string; password: string; remember?: boolean };
type RegisterPayload = { name: string; email: string; password: string };

const handleLogin = async (payload: FormSubmitEvent<LoginPayload>) => {
  const { email, password } = payload.data;
  if (!email || !password) {
    error.value = "Please fill in all required fields.";
    return;
  }

  isLoading.value = true;
  error.value = null;

  try {
    await $fetch("/api/auth/login", {
      method: "POST",
      body: { email, password },
    });

    await fetchSession();
  } catch (e: any) {
    error.value =
      e?.data?.message ||
      e?.statusMessage ||
      "Sign in failed. Please try again.";
  } finally {
    isLoading.value = false;
  }
};

const handleRegister = async (payload: FormSubmitEvent<RegisterPayload>) => {
  const { name, email, password } = payload.data;
  if (!name || !email || !password) {
    error.value = "Please fill in all required fields.";
    return;
  }

  isLoading.value = true;
  error.value = null;

  try {
    await $fetch("/api/auth/register", {
      method: "POST",
      body: { name, email, password },
    });

    toast.add({
      title: "Account created",
      description: "Redirecting to sign in...",
    });

    try {
      await $fetch("/api/auth/login", {
        method: "POST",
        body: { email, password },
      });
      await fetchSession();
    } catch {
      activeTab.value = "login";
    }
  } catch (e: any) {
    error.value =
      e?.statusMessage ||
      e?.data?.message ||
      "Registration failed. Please try again.";
  } finally {
    isLoading.value = false;
  }
};

watch(activeTab, () => {
  error.value = null;
});
</script>

<template>
  <div class="w-full max-w-md">
    <div class="mb-8 text-center">
      <NuxtLink to="/" class="inline-block">
        <div
          class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-900"
        >
          <UIcon name="i-lucide-leaf" size="xl" class="text-primary text-3xl" />
        </div>
        <p class="mt-3 text-xl font-bold">AgroDoctorBot</p>
      </NuxtLink>
    </div>

    <UPageCard>
      <UTabs
        v-model="activeTab"
        :items="tabs"
        class="mb-6"
        :ui="{ list: 'w-full', trigger: 'flex-1 justify-center' }"
      />

      <UAuthForm
        v-if="activeTab === 'login'"
        title="Welcome back"
        description="Sign in to your account to continue."
        icon="i-lucide-lock"
        :fields="loginFields"
        :providers="providers"
        :loading="isLoading"
        :submit="{ label: 'Sign in', icon: 'i-lucide-log-in' }"
        @submit="handleLogin"
      >
        <template #password-hint>
          <ULink
            to="/forgot-password"
            class="text-primary text-sm"
            tabindex="-1"
          >
            Forgot password?
          </ULink>
        </template>

        <template #validation>
          <UAlert
            v-if="error"
            color="error"
            variant="soft"
            icon="i-lucide-alert-circle"
            :title="error"
            class="mt-4"
          />
        </template>
      </UAuthForm>

      <UAuthForm
        v-else
        title="Create your account"
        description="Create an account to start managing farms and seasons."
        icon="i-lucide-user-plus"
        :fields="registerFields"
        :providers="providers"
        :loading="isLoading"
        :submit="{ label: 'Create account', icon: 'i-lucide-user-plus' }"
        @submit="handleRegister"
      >
        <template #validation>
          <UAlert
            v-if="error"
            color="error"
            variant="soft"
            icon="i-lucide-alert-circle"
            :title="error"
            class="mt-4"
          />
        </template>

        <template #footer>
          <p class="text-sm text-gray-500">
            By creating an account, you agree to our
            <ULink to="/terms" class="text-primary">Terms</ULink>.
          </p>
        </template>
      </UAuthForm>
    </UPageCard>

    <div class="mt-6 text-center">
      <UButton
        to="/"
        variant="ghost"
        color="neutral"
        size="sm"
        icon="i-lucide-arrow-left"
        label="Back to home"
      />
    </div>
  </div>
</template>
