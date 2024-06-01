const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
import Log from '../Log.js'
export default function ExpressMessager({ server, wsm}) {
	const em = {
		app: express(),
		setHandler({ name, handler }) {
			Log.debug(`setting handler ${name}`)
			// em.app.post(`/${name}`, (req, res) => {
			// 	Log.debug(`handling post ${name}`)
			// 	Log.debug('req.body', req.body)
			// 	const result = handler(...req.body)
			// 	if (result === undefined) {
			// 		Log.debug('result is undefined')
			// 		res.send(JSON.stringify({}))
			// 		return
			// 	}
			// 	Log.debug('result', result)
			// 	res.send(JSON.stringify(result))
			// })
			wsm.addHandler(`${name}`, (ws, fetchId, ...args) => {
				Log.debug('handling', name, fetchId, args)
				const result = handler(...args)
				if (result === undefined) {
					Log.debug('result is undefined')
					wsm.send(ws, fetchId, {})
					return
				}
				const sendName = `${name}${fetchId}`
				Log.debug('sendName', sendName)
				wsm.send(ws, sendName, result)
			})
		},

	}
	em.app.use(bodyParser.json());
	em.app.use(bodyParser.urlencoded({ extended: true }));
	em.app.use(cors());
	server.on('request', em.app);
	return em
}