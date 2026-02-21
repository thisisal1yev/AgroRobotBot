export default defineNuxtRouteMiddleware(async (to) => {
  const { loggedIn, user } = useUserSession();

  if (!loggedIn.value || !user.value) {
    return navigateTo("/auth");
  }

  const role = user.value.role;

  if (role === "ADMIN" && !to.path.startsWith("/admin")) {
    return navigateTo("/admin");
  }

  if (role === "FARMER" && !to.path.startsWith("/farmer")) {
    return navigateTo("/farmer");
  }
});
