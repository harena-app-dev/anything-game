import { WebSocketServer } from 'ws';
import Log from '../Log.js';
import BaseWebSocketMessager from '../WebSocketMessager.js';
export default function WebSocketMessager(server) {
	const wss = new WebSocketServer({ server });
	return new BaseWebSocketMessager({
		wss,
		forEachConnection(f) {
			wss.clients.forEach(f);
		},
		onConnection(f) {
			wss.on('connection', (ws) => {
				f({
					ws,
					onMessage(f) {
						ws.on('message', f);
					},
					send(data) {
						ws.send(data);
					}
				})
			});
		},
		onListening(f) {
			wss.on('listening', f);
		},
		onMessage(f) {
			wss.on('message', f);
		},
		onClose(f) {
			wss.on('close', f);
		},
		onError(f) {
			wss.on('error', f);
		}
	});
}