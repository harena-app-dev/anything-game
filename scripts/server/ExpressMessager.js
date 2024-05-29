const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
export default function ExpressMessager({ port }) {
	const em = {
		app: express(),
		setHandler({ name, handler }) {
			em.app.post(`/${name}`, (req, res) => {
				console.log(`handling post ${name}`)
				const result = handler(req.body)
				if (result === undefined) {
					res.send(JSON.stringify({}))
					return
				}
				res.send(JSON.stringify(result))
			})
		},

	}
	em.app.use(bodyParser.json());
	em.app.use(bodyParser.urlencoded({ extended: true }));
	em.app.use(cors());

	em.app.listen(port, () => {
		console.log(`Express is running on port ${port}`)
	})
	return em
}