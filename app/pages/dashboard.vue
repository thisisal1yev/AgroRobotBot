<script setup lang="ts">
definePageMeta({
	middleware: ['auth']
})

const { data: user, pending } = await useFetch('/api/auth/me', {
	server: false
})

const toast = useToast()

const handleLogout = async () => {
	try {
		await $fetch('/api/auth/logout', {
			method: 'POST'
		})
		await navigateTo('/auth')
	} catch (e) {
		toast.add({
			title: 'Error',
			description: 'Failed to logout',
			color: 'error'
		})
	}
}
</script>

<template>
	<div class="min-h-screen bg-gray-50 dark:bg-gray-950">
		<AppHeader />

		<main class="container mx-auto px-4 py-8">
			<div
				v-if="pending"
				class="flex justify-center py-12"
			>
				<UIcon
					name="i-lucide-loader-2"
					class="animate-spin text-4xl text-primary"
				/>
			</div>

			<template v-else>
				<div class="mb-8">
					<h1 class="text-3xl font-bold text-gray-900 dark:text-white">
						Welcome, {{ user?.name || 'User' }}!
					</h1>
					<p class="mt-2 text-gray-600 dark:text-gray-400">
						Manage your farms and agricultural data
					</p>
				</div>

				<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					<UPageCard class="p-6">
						<div class="flex items-center gap-4">
							<div
								class="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10"
							>
								<UIcon
									name="i-lucide-tractor"
									class="text-2xl text-primary"
								/>
							</div>
							<div>
								<h3 class="font-semibold">Farms</h3>
								<p class="text-sm text-gray-500">Manage your farms</p>
							</div>
						</div>
					</UPageCard>

					<UPageCard class="p-6">
						<div class="flex items-center gap-4">
							<div
								class="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10"
							>
								<UIcon
									name="i-lucide-map"
									class="text-2xl text-green-500"
								/>
							</div>
							<div>
								<h3 class="font-semibold">Fields</h3>
								<p class="text-sm text-gray-500">View and edit fields</p>
							</div>
						</div>
					</UPageCard>

					<UPageCard class="p-6">
						<div class="flex items-center gap-4">
							<div
								class="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10"
							>
								<UIcon
									name="i-lucide-calendar"
									class="text-2xl text-blue-500"
								/>
							</div>
							<div>
								<h3 class="font-semibold">Seasons</h3>
								<p class="text-sm text-gray-500">Track seasons</p>
							</div>
						</div>
					</UPageCard>
				</div>

				<div class="mt-8">
					<UPageCard class="p-6">
						<h2 class="mb-4 text-xl font-semibold">Your Profile</h2>
						<dl class="grid gap-4 sm:grid-cols-2">
							<div>
								<dt class="text-sm text-gray-500">Name</dt>
								<dd class="font-medium">{{ user?.name || '-' }}</dd>
							</div>
							<div>
								<dt class="text-sm text-gray-500">Email</dt>
								<dd class="font-medium">{{ user?.email || '-' }}</dd>
							</div>
							<div>
								<dt class="text-sm text-gray-500">Member since</dt>
								<dd class="font-medium">
									{{
										user?.createdAt
											? new Date(user.createdAt).toLocaleDateString()
											: '-'
									}}
								</dd>
							</div>
						</dl>

						<div class="mt-6">
							<UButton
								color="error"
								variant="soft"
								icon="i-lucide-log-out"
								label="Logout"
								@click="handleLogout"
							/>
						</div>
					</UPageCard>
				</div>
			</template>
		</main>
	</div>
</template>
