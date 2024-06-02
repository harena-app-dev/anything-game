import Log from './Log.js';
export default function WebSocketMessager(wsw) {
	const wsm = {
		addHandler(name, handler) {
			if (!this.messageNamesToHandlers.has(name)) {
				this.messageNamesToHandlers.set(name, new Set());
			}
			this.messageNamesToHandlers.get(name)?.add(handler);
			return handler;
		},
		removeHandler(name, handler) {
			this.messageNamesToHandlers.get(name)?.delete(handler);
		},
		send(ws, name, ...data) {
			Log.debug('send', ws, name, data);
			// ws.send(JSON.stringify({ name, data }));
			ws.send(JSON.stringify({ name, data }));
			Log.debug('send', ws, name, data);
		},
		forEachConnection(callback) {
			Log.debug('forEachConnection', this._wsw);
			// this.wss.clients.forEach(callback);
			this._wsw.forEachConnection(callback);
		},
		sendToAll(name, ...data) {
			Log.debug(`sendToAll ${name} ${JSON.stringify(data)}`);
			// this.wss.clients.forEach(ws => {
			this.forEachConnection(ws => {
				Log.debug('sendToAll', ws);
				Log.debug('sendToAll', ws.readyState);
				this.send(ws, name, ...data);
			});
		},
		addConnectionHandler(handler) {
			this.connectionHandlers.add(handler);
		},
		removeConnectionHandler(handler) {
			this.connectionHandlers.delete(handler);
		},
		setWsw(wsw) {
			this._wsw = wsw;
			Log.debug('setWsw', wsw);
			wsw.onConnection((ws) => {
				Log.debug('connection', ws);
				// Log.debug('connection', ws.ws.readyState);
				const connectionHandlers = wsm.connectionHandlers;
				connectionHandlers.forEach(handler => handler(ws));
				ws.onMessage((str) => {
					Log.debug(`received message: ${str}`);
					let message;
					try {
						Log.debug('data', str);
						message = JSON.parse(str);
					}
					catch (error) {
						console.error('error parsing message', event.data);
						return;
					}
					const handlers = wsm.messageNamesToHandlers.get(message.name);
					if (handlers) {
						if (!(message.data instanceof Array)) {
							message.data = [message.data];
						}
						Log.debug('message', message);
						handlers.forEach(handler => handler(ws, ...message.data));
					} else {
						Log.debug(`No handler for message name: ${message.name}`);
					}
				});
			});
			wsw.onListening(() => {
				Log.debug('listening');
			});
			wsw.onClose(() => {
				Log.debug('close');
			});
			wsw.onError((error) => {
				Log.error('error', error);
			});
		},
		setFetchHandler({ name, handler }) {
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
		messageNamesToHandlers: new Map(),
		connectionHandlers: new Set(),
	};

	return wsm;
}