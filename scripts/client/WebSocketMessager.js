import { WebSocketServer } from 'ws';
import Log from '../Log.js';
import BaseWebSocketMessager from '../WebSocketMessager.js';
import { offsetPortOfCurrentUrl } from '../Utils.js';
export default function WebSocketMessager({ onConnection }) {
	const onConnectionArg = onConnection;
	const wsUrl = offsetPortOfCurrentUrl(1).replace('http', 'ws');
	const ws = new WebSocket(wsUrl)
	return new BaseWebSocketMessager({
		forEachConnection(f) {
			// ws.clients.forEach(f);
			f(ws);
		},
		onConnection(f) {
			ws.onopen = () => {
				Log.debug('WebSocketMessager onopen');
				onConnectionArg();
				f({
					ws,
					onMessage(f) {
						// ws.on('message', f);
						// ws.onmessage = f;
						ws.onmessage = (e) => {
							f(e.data);
						};
					},
					send(data) {
						ws.send(data);
					}
				})
			};
		},
		onListening(f) {
		},
		onClose(f) {
			ws.onclose = f;
		},
		onError(f) {
			ws.onerror = f;
		}
	});
}