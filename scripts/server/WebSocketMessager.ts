import 'server-only'
import WebSocket, { WebSocketServer } from 'ws';
type Handler = (ws: WebSocket, data: any) => void;
export default class WebSocketMessager {
	wss: WebSocketServer;
	messageNamesToHandlers: Map<string, Set<Handler>> = new Map();
	constructor() {
		console.log('WebSocketMessager constructor');
		this.wss = new WebSocketServer({ port: 3001 });
		this.wss.on('connection', (ws) => {
			console.log('connected');
			ws.on('message', (data) => {
				const message = JSON.parse(data.toString());
				const handlers = this.messageNamesToHandlers.get(message.name);
				if (handlers) {
					handlers.forEach(handler => handler(ws, message.data));
				} else {
					console.log(`No handler for message name: ${message.name}`);
				}
			});
		});
		this.wss.on('listening', () => {
			console.log('listening');
		});
		this.wss.on('close', () => {
			console.log('close');
		});
		this.wss.on('error', (error) => {
			console.log('error', error);
		});
		console.log('WebSocketMessager constructor end'); 
	}
	addHandler(name: string, handler: Handler) {
		if (!this.messageNamesToHandlers.has(name)) {
			this.messageNamesToHandlers.set(name, new Set());
		}
		this.messageNamesToHandlers.get(name)?.add(handler);
	}
	removeHandler(name: string, handler: Handler) {
		this.messageNamesToHandlers.get(name)?.delete(handler);
	}
	send(ws: WebSocket, name: string, data: any) {
		ws.send(JSON.stringify({ name, data }));
	}
}