import WebSocketMessager from "../../WebSocketMessager";
import Log from "../../Log";
import http from 'http';
import { WebSocketServer } from 'ws';
export default function (registry, systems) {
	this.tick = function () {
	}
	this.destructor = function () {
	}
	const server = http.createServer();
	const wss = new WebSocketServer({ server });
	const wsm = WebSocketMessager(server);
	this.getWsm = function () {
		return wsm;
	}
	wsm.setWsw({
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
	})
	server.listen(3001, function () {});
}