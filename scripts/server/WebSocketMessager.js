import WebSocket, { WebSocketServer } from 'ws';

// export type Handler = (ws, data) => void;
export default function WebSocketMessager() {
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
			this.wss.clients.forEach(ws => {
				this.send(ws, name, data);
			});
		},
		messageNamesToHandlers: new Map(),
		wss: new WebSocketServer({ port: 3001 }),
	};
	wsm.wss.on('connection', (ws) => {
		console.log(`${ws.protocol} connected`);
		ws.on('message', (data) => {
			console.log(`received message: ${data.toString()}`);
			const message = JSON.parse(data.toString());
			const handlers = wsm.messageNamesToHandlers.get(message.name);
			if (handlers) {
				handlers.forEach(handler => handler({ws, args: message.data}));
			} else {
				console.log(`No handler for message name: ${message.name}`);
			}
		});
	});
	wsm.wss.on('listening', () => {
		console.log('listening');
	});
	wsm.wss.on('close', () => {
		console.log('close');
	});
	wsm.wss.on('error', (error) => {
		console.log('error', error);
	});
	return wsm;
}