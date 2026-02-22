/**
 * Dashboard composable: base path, navigation and global shortcuts (g-*) for admin and farmer.
 */
export function useDashboard() {
  const route = useRoute();

  const basePath = computed(() => {
    const p = route.path;
    if (p.startsWith("/admin")) return "/admin";
    if (p.startsWith("/farmer")) return "/farmer";
    return "";
  });

  const go = (path: string) => navigateTo(path);

  defineShortcuts({
    "g-h": () => {
      const base = basePath.value;
      if (base === "/admin") go("/admin");
      else if (base === "/farmer") go("/farmer");
    },

    "g-u": () => {
      if (basePath.value === "/admin") go("/admin/users");
    },

    "g-f": () => {
      const base = basePath.value;
      if (base === "/admin") go("/admin/farms");
      else if (base === "/farmer") go("/farmer/farms");
    },

    "g-m": () => {
      const base = basePath.value;
      if (base === "/admin") go("/admin/fields");
      else if (base === "/farmer") go("/farmer/fields");
    },

    "g-r": () => {
      if (basePath.value === "/admin") go("/admin/reports");
    },

    "g-a": () => {
      const base = basePath.value;
      if (base === "/admin") go("/admin/alerts");
      else if (base === "/farmer") go("/farmer/alerts");
    },

    "g-b": () => {
      const base = basePath.value;
      if (base === "/admin") go("/admin/robots");
      else if (base === "/farmer") go("/farmer/robots");
    },

    "g-s": () => {
      const base = basePath.value;
      if (base === "/admin") go("/admin/settings");
      else if (base === "/farmer") go("/farmer/seasons");
    },

    "g-p": () => {
      if (basePath.value === "/farmer") go("/farmer/predictions");
    },

    "g-y": () => {
      const base = basePath.value;
      if (base === "/farmer") go("/farmer/settings");
    },
  });

  return {
    basePath,
    go,
  };
}
