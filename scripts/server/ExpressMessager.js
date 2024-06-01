import Log from '../Log.js'
export default function ExpressMessager({ server, wsm}) {
	const em = {
		setHandler({ name, handler }) {
			Log.debug(`setting handler ${name}`)
			wsm.addHandler(`${name}`, (ws, fetchId, ...args) => {
				Log.debug('handling', name, fetchId, args)
				const result = handler(ws, ...args)
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
	return em
}