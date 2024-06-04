import WebSocketMessager from "../../WebSocketMessager";
import Log from "../../Log";
import http from 'http';
import https from 'https';
import fs from 'fs';
import { WebSocketServer } from 'ws';
export default function (registry, systems) {

	// const server = http.createServer();
	const server = https.createServer({
		cert: fs.readFileSync('certificates/localhost.pem'),
		key: fs.readFileSync('certificates/localhost-key.pem')
	  });
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
		},
		close() {
			wss.close();
		}
	})
	server.listen(3001, function () {});
	this.tick = function () {
	}
	this.destructor = function () {
	}
}