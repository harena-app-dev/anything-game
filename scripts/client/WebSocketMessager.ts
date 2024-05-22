import 'client-only'
type Handler = (data: any) => void;
export default class WebSocketMessager {
	ws: WebSocket;
	messageNamesToHandlers: Map<string, Set<Handler>> = new Map();
	constructor() {
		const currentAddress = window.location.href.split('/')[2];
		const protocol = currentAddress.split(':')[0];
		const port = parseInt(currentAddress.split(':')[1]);
		this.ws = new WebSocket(`ws://${protocol}:${port + 1}`);
		this.ws.onopen = () => {
			console.log('connected');
		}
		this.ws.onmessage = (event) => {
			const message = JSON.parse(event.data);
			const handlers = this.messageNamesToHandlers.get(message.name);
			if (handlers) {
				handlers.forEach(handler => handler(message.data));
			}
		}
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
	send(name: string, data: any) {
		this.ws.send(JSON.stringify({ name, data }));
	}
}