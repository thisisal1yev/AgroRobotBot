<script lang="ts" setup>
definePageMeta({
  layout: "farmer",
  middleware: ["auth"],
});
</script>

<template>
  <pre>{{ $route.params.id }}</pre>
</template>
