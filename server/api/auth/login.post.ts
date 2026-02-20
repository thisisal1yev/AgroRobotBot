import argon2 from 'argon2'

export default defineEventHandler(async event => {
	const body = await readBody(event)

	if (!body.email || !body.password) {
		throw createError({
			statusCode: 400,
			message: 'Email and password are required'
		})
	}

	const user = await prisma.user.findUnique({
		where: { email: body.email }
	})

	if (!user) {
		throw createError({
			statusCode: 401,
			message: 'Invalid credentials'
		})
	}

	const validPassword = await argon2.verify(user.password, body.password)

	if (!validPassword) {
		throw createError({
			statusCode: 401,
			message: 'Invalid credentials'
		})
	}

	await setUserSession(event, {
		user: {
			id: user.id,
			email: user.email,
			name: user.name
		}
	})

	return {
		id: user.id,
		email: user.email,
		name: user.name
	}
})
