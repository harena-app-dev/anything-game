import { WebSocketServer } from 'ws';
import Log from '../Log.js';
// export default function WebSocketMessager({server}) {
export default function WebSocketMessager(wsw) {
	const wsm = {
		addHandler(name, handler) {
			if (!this.messageNamesToHandlers.has(name)) {
				this.messageNamesToHandlers.set(name, new Set());
			}
			this.messageNamesToHandlers.get(name)?.add(handler);
		},
		removeHandler(name, handler) {
			this.messageNamesToHandlers.get(name)?.delete(handler);
		},
		send(ws, name, data) {
			ws.send(JSON.stringify({ name, data }));
		},
		sendToAll(name, data) {
			Log.debug(`sendToAll ${name} ${JSON.stringify(data)}`);
			this.wss.clients.forEach(ws => {
				this.send(ws, name, data);
			});
		},
		addConnectionHandler(handler) {
			this.connectionHandlers.add(handler);
		},
		removeConnectionHandler(handler) {
			this.connectionHandlers.delete(handler);
		},
		messageNamesToHandlers: new Map(),
		connectionHandlers: new Set(),
	};

	wsm.wss.onConnection((ws) => {
		const connectionHandlers = wsm.connectionHandlers;
		connectionHandlers.forEach(handler => handler(ws));
		ws.on('message', (data) => {
			Log.debug(`received message: ${data.toString()}`);
			let message;
			try {
				message = JSON.parse(data.toString());
			}
			catch (error) {
				console.error('error parsing message', event.data);
				return;
			}
			const handlers = wsm.messageNamesToHandlers.get(message.name);
			if (handlers) {
				// handlers.forEach(handler => handler({ws, args: message.data}));
				Log.info('message', message);
				if (!(message.data instanceof Array)) {
					message.data = [message.data];
				}
				handlers.forEach(handler => handler(ws, ...message.data));
			} else {
				Log.debug(`No handler for message name: ${message.name}`);
			}
		});
	});
	wsm.wss.onListening(() => {
		Log.debug('listening');
	});
	wsm.wss.onClose(() => {
		Log.debug('close');
	});
	wsm.wss.onError((error) => {
		Log.error('error', error);
	});
	return wsm;
}