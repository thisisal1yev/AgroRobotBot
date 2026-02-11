<script setup lang="ts">
useHead({
  title: "AgroRobotBot — Smart Farming with AI & Solar Robotics",
  meta: [
    {
      name: "description",
      content:
        "AgroRobotBot is a solar-powered AI agrobot with an onboard lab for soil analytics, plant disease detection, and real-time recommendations.",
    },
    { name: "theme-color", content: "#16a34a" },
  ],
});

const heroPills = [
  { title: "Soil analysis", subtitle: "Moisture • pH • NPK" },
  { title: "Plant health", subtitle: "AI disease detection" },
  { title: "Energy", subtitle: "Solar-powered, off-grid" },
];

const trustCards = [
  {
    icon: "i-lucide-shield-check",
    title: "Field-ready",
    subtitle: "Designed for remote & off-grid areas",
  },
  {
    icon: "i-lucide-gauge",
    title: "Real-time insights",
    subtitle: "Telemetry + alerts + recommendations",
  },
  {
    icon: "i-lucide-flask-round",
    title: "Onboard laboratory",
    subtitle: "Soil sampling & diagnostics in the field",
  },
];

const features = [
  {
    icon: "i-lucide-activity",
    title: "Sensor telemetry",
    body: "Stream and review soil moisture, pH, NPK and EC over time with clean visualizations.",
  },
  {
    icon: "i-lucide-camera",
    title: "AI plant health",
    body: "Upload images captured by the robot (or drone) and detect diseases early with confidence scoring.",
  },
  {
    icon: "i-lucide-bell",
    title: "Smart alerts",
    body: "Threshold-based alerts that prevent spam: grouped, deduplicated, and easy to resolve.",
  },
  {
    icon: "i-lucide-lightbulb",
    title: "Recommendations",
    body: "Turn raw metrics into concrete actions: irrigation, fertilization, monitoring, and follow-ups.",
  },
  {
    icon: "i-lucide-battery-charging",
    title: "Robot monitoring",
    body: "Track battery level, online/offline status, last seen time, and field missions.",
  },
  {
    icon: "i-lucide-file-text",
    title: "Reports",
    body: "Export telemetry and alerts as CSV (PDF can be added later) for agronomic reviews and audits.",
  },
];

const how = [
  {
    step: 1,
    title: "Collect",
    body: "The robot measures soil and environmental parameters and captures images in the field.",
  },
  {
    step: 2,
    title: "Ingest",
    body: "Data is sent to the platform using secure device keys and validated on the server.",
  },
  {
    step: 3,
    title: "Analyze",
    body: "Charts, thresholds, and AI image analysis produce health status, alerts, and recommendations.",
  },
  {
    step: 4,
    title: "Act",
    body: "Farmers get clear next steps and can export reports for agronomists and partners.",
  },
];

const useCases = [
  {
    title: "Small & medium farms",
    body: "Reduce manual scouting and act on early warnings for irrigation, nutrients, and disease risk.",
  },
  {
    title: "Remote/off-grid areas",
    body: "Solar-powered operations, low connectivity assumptions, and field-first diagnostics.",
  },
  {
    title: "Research & pilots",
    body: "Standardized telemetry, clean exports, and reproducible reports for trials and collaboration.",
  },
];

const faqs = [
  {
    label: "Does it work offline?",
    content:
      "The robot can operate off-grid with solar power. Data sync depends on connectivity and can be buffered.",
  },
  {
    label: "What sensors are supported?",
    content:
      "Soil moisture, pH, NPK, and EC are first-class. Additional metrics can be added to telemetry ingestion.",
  },
  {
    label: "How are alerts generated?",
    content:
      "Alerts are threshold-based and deduplicated to avoid spam. They can be resolved and tracked over time.",
  },
  {
    label: "Is AI required for launch?",
    content:
      "No. You can start with rule-based recommendations and add AI image analysis later.",
  },
];
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <div class="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <UBadge
            variant="outline"
            class="rounded-full"
            icon="i-lucide-sparkles"
          >
            AI Agrobot • Soil Analytics • Smart Recommendations
          </UBadge>

          <h1 class="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">
            Autonomous AI robotics for modern agriculture.
          </h1>

          <p class="mt-4 text-base text-muted leading-relaxed sm:text-lg">
            Real-time soil analysis, plant disease detection, and actionable
            field recommendations.
          </p>

          <div class="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <UButton
              to="#contact"
              color="primary"
              variant="solid"
              size="lg"
              icon="i-lucide-rocket"
              class="justify-center"
            >
              Get a pilot
            </UButton>

            <UButton
              to="#features"
              color="neutral"
              variant="outline"
              size="lg"
              icon="i-lucide-play"
              class="justify-center"
            >
              See features
            </UButton>
          </div>
        </div>

        <!-- Hero visual -->
        <div class="relative">
          <div class="absolute -inset-4 rounded-3xl blur-2xl" />
          <UCard class="relative rounded-3xl" :ui="{ body: 'p-6' }">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-bot" class="h-5 w-5 text-green-600" />
                <div class="text-sm font-semibold">Live Field Snapshot</div>
              </div>
              <UBadge color="primary" variant="subtle">Online</UBadge>
            </div>

            <div class="mt-6 grid gap-3 sm:grid-cols-2">
              <UCard class="rounded-2xl" :ui="{ body: 'p-4' }">
                <div class="flex items-center justify-between">
                  <div class="text-sm font-medium">Soil moisture</div>
                  <UIcon
                    name="i-lucide-droplets"
                    class="h-4 w-4 text-green-600"
                  />
                </div>
                <div class="mt-2 text-2xl font-semibold">23%</div>
                <div class="mt-1 text-xs text-neutral-500">
                  Last updated: 2 min ago
                </div>
              </UCard>

              <UCard class="rounded-2xl" :ui="{ body: 'p-4' }">
                <div class="flex items-center justify-between">
                  <div class="text-sm font-medium">pH</div>
                  <UIcon
                    name="i-lucide-flask-conical"
                    class="h-4 w-4 text-green-600"
                  />
                </div>
                <div class="mt-2 text-2xl font-semibold">6.4</div>
                <div class="mt-1 text-xs text-neutral-500">
                  Optimal range: 6.0–7.0
                </div>
              </UCard>

              <UCard class="rounded-2xl" :ui="{ body: 'p-4' }">
                <div class="flex items-center justify-between">
                  <div class="text-sm font-medium">NPK status</div>
                  <UIcon
                    name="i-lucide-bar-chart-3"
                    class="h-4 w-4 text-green-600"
                  />
                </div>
                <div class="mt-2 text-2xl font-semibold">Balanced</div>
                <div class="mt-1 text-xs text-neutral-500">
                  N: 42 • P: 17 • K: 35
                </div>
              </UCard>

              <UCard class="rounded-2xl" :ui="{ body: 'p-4' }">
                <div class="flex items-center justify-between">
                  <div class="text-sm font-medium">Alert</div>
                  <UIcon
                    name="i-lucide-triangle-alert"
                    class="h-4 w-4 text-amber-600"
                  />
                </div>
                <div class="mt-2 text-sm font-semibold">
                  Moisture below threshold
                </div>
                <div class="mt-1 text-xs text-neutral-500">
                  Recommendation: irrigate 12–18mm
                </div>
              </UCard>
            </div>

            <UCard class="mt-6 rounded-2xl" :ui="{ body: 'p-4' }">
              <div class="flex items-center justify-between">
                <div class="text-sm font-medium">Recommendation</div>
                <UIcon
                  name="i-lucide-lightbulb"
                  class="h-4 w-4 text-green-600"
                />
              </div>

              <ul class="mt-3 space-y-2 text-sm">
                <li class="flex gap-2">
                  <UIcon
                    name="i-lucide-check"
                    class="mt-0.5 h-4 w-4 text-green-600"
                  />
                  Apply drip irrigation in the next 24 hours
                </li>
                <li class="flex gap-2">
                  <UIcon
                    name="i-lucide-check"
                    class="mt-0.5 h-4 w-4 text-green-600"
                  />
                  Monitor leaves for early fungal symptoms
                </li>
                <li class="flex gap-2">
                  <UIcon
                    name="i-lucide-check"
                    class="mt-0.5 h-4 w-4 text-green-600"
                  />
                  Recheck soil EC after irrigation
                </li>
              </ul>
            </UCard>
          </UCard>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section
      id="features"
      class="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20"
    >
      <div class="max-w-2xl">
        <h2 class="text-2xl text-primary font-semibold tracking-tight sm:text-3xl">
          Everything you need to monitor fields.
        </h2>

        <p class="mt-3">
          A single platform for soil analytics, plant health, robotics
          monitoring, and actionable recommendations.
        </p>
      </div>

      <div class="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        <UPageCard
          v-for="f in features"
          spotlight
          :key="f.title"
          :ui="{ body: 'p-6' }"
        >
          <UIcon :name="f.icon" size="18" class="text-green-600" />
          <h3 class="mt-3 text-sm font-semibold">{{ f.title }}</h3>
          <p class="mt-2 text-sm">{{ f.body }}</p>
        </UPageCard>
      </div>
    </section>

    <!-- How it works -->
    <section id="how-it-works" class="border-y border-default bg-muted">
      <div class="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <div class="max-w-2xl">
          <h2 class="text-2xl text-primary font-semibold tracking-tight sm:text-3xl">
            How it works
          </h2>
          <p class="mt-3">Simple pipeline from field sensors to decisions.</p>
        </div>

        <div class="mt-10 grid gap-5 lg:grid-cols-4">
          <UCard
            v-for="s in how"
            :key="s.step"
            class="rounded-3xl"
            :ui="{ body: 'p-6' }"
          >
            <div class="flex items-center gap-2 text-sm font-semibold">
              <span
                class="inline-flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-white"
              >
                {{ s.step }}
              </span>
              {{ s.title }}
            </div>
            <p class="mt-2 text-sm">
              {{ s.body }}
            </p>
          </UCard>
        </div>
      </div>
    </section>

    <!-- Use cases -->
    <section
      id="use-cases"
      class="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20"
    >
      <div class="max-w-2xl">
        <h2 class="text-2xl text-primary font-semibold tracking-tight sm:text-3xl">
          Use cases
        </h2>
        <p class="mt-3">
          Built for farms, research pilots, and advisory programs.
        </p>
      </div>

      <div class="mt-10 grid gap-5 lg:grid-cols-3">
        <UCard
          v-for="u in useCases"
          :key="u.title"
          class="rounded-3xl"
          :ui="{ body: 'p-6' }"
        >
          <h3 class="text-sm font-semibold">{{ u.title }}</h3>
          <p class="mt-2 text-sm">
            {{ u.body }}
          </p>
        </UCard>
      </div>
    </section>

    <!-- CTA / Contact -->
    <section id="contact" class="border-t border-default bg-muted">
      <div class="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <!-- Left -->
          <div>
            <h2 class="text-2xl text-primary font-semibold tracking-tight sm:text-3xl">
              Want to run a pilot with AgroRobotBot?
            </h2>

            <p class="mt-3 text-muted">
              Share your farm size, crop type, and location. We will respond
              with a pilot plan and required setup.
            </p>
          </div>

          <!-- Right: Form -->
          <UForm class="grid gap-4 bg-default p-5 rounded-md" @submit.prevent>
            <UFormField label="Full name">
              <UInput class="w-full" placeholder="Jane Doe" />
            </UFormField>

            <UFormField label="Email">
              <UInput class="w-full" type="email" placeholder="jane@farm.com" />
            </UFormField>

            <UFormField label="Farm size (hectares)">
              <UInput class="w-full" type="number" placeholder="25" />
            </UFormField>

            <UFormField label="Crop">
              <UInput class="w-full" placeholder="Cotton / Wheat / Tomato..." />
            </UFormField>

            <UFormField label="Message">
              <UTextarea
                class="w-full"
                :rows="4"
                placeholder="Tell us about your field conditions and what you want to monitor."
              />
            </UFormField>

            <div class="flex items-center justify-end">
              <UButton
                color="primary"
                variant="solid"
                icon="i-lucide-send"
                type="submit"
              >
                Send request
              </UButton>
            </div>
          </UForm>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section id="faq" class="mx-auto max-w-3xl px-4 py-24 sm:px-6 lg:px-8">
      <div class="text-center">
        <h2 class="text-3xl font-bold text-primary tracking-tight sm:text-4xl">
          FAQ
        </h2>

        <p class="mx-auto mt-4 max-w-2xl text-lg text-muted">
          Quick answers about deployment and data.
        </p>
      </div>

      <UAccordion :items="faqs" class="mt-12" :ui="{ body: 'text-muted' }" />
    </section>
  </div>
</template>
