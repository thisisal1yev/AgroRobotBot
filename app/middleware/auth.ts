export default defineNuxtRouteMiddleware(async (to) => {
  const { loggedIn, user } = useUserSession();

  if (!loggedIn.value || !user.value) {
    return navigateTo("/auth");
  }
});
