const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
import Log from '../Log.js'
export default function ExpressMessager({ port }) {
	const em = {
		app: express(),
		setHandler({ name, handler }) {
			Log.info(`setting handler ${name}`)
			em.app.post(`/${name}`, (req, res) => {
				Log.info(`handling post ${name}`)
				Log.info('req.body', req.body)
				const result = handler(...req.body)
				if (result === undefined) {
					Log.info('result is undefined')
					res.send(JSON.stringify({}))
					return
				}
				Log.info('result', result)
				res.send(JSON.stringify(result))
			})
		},

	}
	em.app.use(bodyParser.json());
	em.app.use(bodyParser.urlencoded({ extended: true }));
	em.app.use(cors());

	em.app.listen(port, () => {
		Log.debug(`Express is running on port ${port}`)
	})
	return em
}