<script setup lang="ts">
definePageMeta({
  layout: "farmer",
  middleware: ["auth"],
});

const route = useRoute();
const predictionId = route.params.id as string;

const { data: prediction, status } = await useFetch(`/api/plant-analyses/${predictionId}`, {
  server: false,
});
</script>

<template>
  <UDashboardPanel id="farmer-prediction-detail">
    <template #header>
      <UDashboardNavbar :title="prediction?.healthy ? 'Healthy Plant' : (prediction?.disease || 'Prediction')">
        <template #leading>
          <UDashboardSidebarCollapse />
          <UButton
            icon="i-lucide-arrow-left"
            color="neutral"
            variant="ghost"
            to="/farmer/predictions"
            class="mr-2"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div v-if="status === 'pending'" class="flex justify-center py-12">
        <UIcon name="i-lucide-loader-circle" class="size-8 animate-spin text-muted" />
      </div>

      <div v-else-if="!prediction" class="text-center py-12">
        <UIcon name="i-lucide-brain" class="size-12 text-muted mx-auto mb-2" />
        <p class="text-sm text-muted">Prediction not found</p>
      </div>

      <div v-else class="space-y-6">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Field"
            :value="prediction.field?.name || 'Unknown'"
            icon="i-lucide-map"
            color="text-blue-500"
            bg="bg-blue-500/10"
          />
          <StatCard
            label="Farm"
            :value="prediction.field?.farm?.name || 'Unknown'"
            icon="i-lucide-tractor"
            color="text-green-500"
            bg="bg-green-500/10"
          />
          <StatCard
            label="Status"
            :value="prediction.healthy ? 'Healthy' : 'Disease Detected'"
            icon="i-lucide-circle-check"
            :color="prediction.healthy ? 'text-success' : 'text-error'"
            :bg="prediction.healthy ? 'bg-success/10' : 'bg-error/10'"
          />
          <StatCard
            label="Confidence"
            :value="`${Math.round(prediction.confidence * 100)}%`"
            icon="i-lucide-target"
            color="text-amber-500"
            bg="bg-amber-500/10"
          />
        </div>

        <UCard>
          <template #header>
            <h4 class="font-semibold">Analysis Details</h4>
          </template>
          <div class="space-y-4">
            <div v-if="!prediction.healthy && prediction.disease" class="space-y-2">
              <p class="text-sm text-muted">Detected Disease</p>
              <p class="text-highlighted font-medium">{{ prediction.disease }}</p>
            </div>
            <div class="space-y-2">
              <p class="text-sm text-muted">Analysis Date</p>
              <p class="text-highlighted">{{ formatDate(prediction.createdAt) }}</p>
            </div>
          </div>
        </UCard>

        <UCard>
          <template #header>
            <h4 class="font-semibold">Scanned Image</h4>
          </template>
          <div class="flex justify-center">
            <img
              :src="prediction.imageUrl"
              alt="Scanned plant"
              class="max-w-full h-auto max-h-96 rounded-lg object-contain"
            >
          </div>
        </UCard>
      </div>
    </template>
  </UDashboardPanel>
</template>
