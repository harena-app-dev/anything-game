import { WebSocketServer } from 'ws';
import Log from '../Log.js';
export default function WebSocketMessager({server}) {
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
		wss: new WebSocketServer({ server }),
	};

	wsm.wss.on('connection', (ws) => {
		const connectionHandlers = wsm.connectionHandlers;
		connectionHandlers.forEach(handler => handler(ws));
		Log.debug(`${ws.protocol} connected`);
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
				handlers.forEach(handler => handler({ws, args: message.data}));
			} else {
				Log.debug(`No handler for message name: ${message.name}`);
			}
		});
	});
	wsm.wss.on('listening', () => {
		Log.debug('listening');
	});
	wsm.wss.on('close', () => {
		Log.debug('close');
	});
	wsm.wss.on('error', (error) => {
		Log.debug('error', error);
	});
	return wsm;
}