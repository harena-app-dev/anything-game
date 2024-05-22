import WebSocketMessager from "./WebSocketMessager";

const webSocketMessager = new WebSocketMessager();

export default function main() {
	console.log('main');
	webSocketMessager.addHandler('consoleMessages', (ws, _) => {
		webSocketMessager.send(ws, 'consoleMessages', ['Hello from server', 'Hello from server 2']);
	});
} 