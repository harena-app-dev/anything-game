const express = require('express')

export default function ExpressMessager({port}) {
	const em = {
		app: express(),
		setGetHandler({name, handler}) {
			em.app.get(name, handler)
		},
		setPostHandler({name, handler}) {
			em.app.post(name, handler)
		},
	}
	em.app.use(express.json())
	em.app.use(express.urlencoded({ extended: true }))
	em.app.get('/', (req, res) => {
		res.send('Welcome to the homepage!')
	})
	em.app.get('/user/:id', (req, res) => {
		const userId = req.params.id
		res.send(`User ID: ${userId}`)
	})
	em.app.post('/submit', (req, res) => {
		const { name, email } = req.body
		res.send(`Name: ${name}, Email: ${email}`)
	})
	em.app.listen(port, () => {
		console.log(`Server is running on port ${port}`)
	})
	return em
}