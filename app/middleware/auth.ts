import type { UserRole } from "~/constants/roles";
import { ROLE_REDIRECTS } from "~/constants/routes";

export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn, user } = useUserSession();

  if (!loggedIn.value || !user.value?.role) {
    if (to.path === "/auth") return;
    return navigateTo("/auth");
  }

  const role = user.value.role as UserRole;
  const base = ROLE_REDIRECTS[role];

  if (to.path === base || to.path.startsWith(base + "/")) return;

  return navigateTo(base);
});
