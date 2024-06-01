import WebSocketMessager from "../../WebSocketMessager";
import Log from "../../Log";
import http from 'http';
import { WebSocketServer } from 'ws';


export default function (registry, systems) {
	const usernames = {};
	const wsToAccounts = {};
	const accountsToWs = {};
	registry.view('Account').each((entity, account) => {
		usernames[account.username] = entity;
	});
	const server = http.createServer();
	const wss = new WebSocketServer({ server });
	const wsm = WebSocketMessager(server);
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
	server.listen(3001, function () {
	});
	registry.onEmplace().connect(function (...args) {
		wsm.sendToAll('update', ...args);
	})
	registry.onUpdate().connect(function (...args) {
		const [type, entity, component] = args;
		if (registry.has('AccountOwner', entity)) {
			const accountEntity = registry.get('AccountOwner', entity).accountEntity;
			wsm.forEachConnection(ws => {
				if (ws === accountsToWs[accountEntity]) {
					return;
				}
				wsm.send(ws, 'update', ...args);
			});
			return;
		}
		wsm.sendToAll('update', ...args);
	})
	registry.onErase().connect(function (...args) {
		wsm.sendToAll('erase', ...args);
	})
	registry.onDestroy().connect(function (...args) {
		wsm.sendToAll('destroy', ...args);
	})
	wsm.setFetchHandler({
		name: 'login',
		handler: (ws, { username, password, isCreate }) => {
			if (isCreate) {
				if (usernames[username] !== undefined) {
					return { message: 'Username already exists' }
				}
				const accountEntity = registry.create();
				const playerEntity = registry.create();
				registry.emplace('Sprite', playerEntity, { path: 'rogue.png' });
				registry.emplace('Account', accountEntity, { username, password, playerEntity });
				registry.emplace('AccountOwner', playerEntity, { accountEntity });
				usernames[username] = accountEntity;
			}
			const accountEntity = usernames[username];
			if (accountEntity === undefined) {
				return { message: 'Invalid combination' }
			}
			const account = registry.get('Account', accountEntity);
			if (account.password !== password) {
				return { message: 'Invalid combination' }
			}
			wsToAccounts[ws] = accountEntity;
			accountsToWs[accountEntity] = ws;
			return { accountEntity, message: 'Login successful' }
		},
	});
	wsm.setFetchHandler({
		name: 'toJson',
		handler: (ws, ...args) => {
			return registry.toJson();
		},
	});
	wsm.setFetchHandler({
		name: 'createAsync',
		handler: (ws, ...args) => {
			return registry.create();
		},
	});
	wsm.setFetchHandler({
		name: 'emplaceAsync',
		handler: (ws, ...args) => {
			return registry.emplace(...args);
		},
	});
	wsm.setFetchHandler({
		name: 'updateAsync',
		handler: (ws, ...args) => {
			return registry.update(...args);
		},
	});
	wsm.setFetchHandler({
		name: 'eraseAsync',
		handler: (ws, ...args) => {
			return registry.erase(...args);
		},
	});
	wsm.setFetchHandler({
		name: 'destroyAsync',
		handler: (ws, ...args) => {
			return registry.destroy(...args);
		},
	});
	const update = wsm.addHandler('update', (ws, type, serverEntity, component) => {
		registry.emplaceOrReplace(type, serverEntity, component);
	});
	const handlers = [update,
		wsm.addHandler('erase', (ws, type, serverEntity) => {
			registry.erase(type, serverEntity);
		}),
		wsm.addHandler('destroy', (ws, serverEntity) => {
			registry.destroy(serverEntity);
		}),
	];
	this.destructor = () => {
		handlers.forEach((handler) => {
			this.wsm.removeHandler(handler);
		})
		this.wsm.close();
	}
}