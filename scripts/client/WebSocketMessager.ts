import 'client-only'
import Log from '../Log'
type Handler = (data: any) => void;
export default class WebSocketMessager {
	ws: WebSocket;
	messageNamesToHandlers: Map<string, Set<Handler>> = new Map();
	constructor(onopen: () => void) {
		const currentAddress = window.location.href.split('/')[2];
		const protocol = currentAddress.split(':')[0];
		const port = parseInt(currentAddress.split(':')[1]);
		this.ws = new WebSocket(`ws://${protocol}:${port + 1}`);
		this.ws.onopen = onopen;
		this.ws.onmessage = (event) => {
			let message: any;
			try {
				message = JSON.parse(event.data);
			}
			catch (error) {
				console.error('error parsing message', event.data);
				return;
			}
			Log.debug('received message', message);
			const handlers = this.messageNamesToHandlers.get(message.name);
			if (handlers) {
				handlers.forEach(handler => {
					Log.debug(`calling handler for message ${message.name}, data: ${JSON.stringify(message.data)}`);
					handler({ws: this.ws, args: message.data})
				});
			}
		}
	}
	addHandler(name: string, handler: Handler) {
		if (!this.messageNamesToHandlers.has(name)) {
			this.messageNamesToHandlers.set(name, new Set());
		}
		this.messageNamesToHandlers.get(name)?.add(handler);
		return handler;
	}
	removeHandler(name: string, handler: Handler) {
		this.messageNamesToHandlers.get(name)?.delete(handler);
	}
	send(name: string, data: any = {}) {
		const message = JSON.stringify({ name, data });
		this.ws.send(message);
	}
	sendToAll(name: string, data: any = {}) {
		this.send(name, data);
	}
	close() {
		this.ws.close();
	}
}