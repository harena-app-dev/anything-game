import WebSocketMessager from "../../server/WebSocketMessager";
import ExpressMessager from "../../server/ExpressMessager";
import Log from "../../Log";
import http from 'http';

export default function (registry, systems) {
	const usernames = {};
	const wsToAccounts = {};
	const accountsToWs = {};
	registry.view('Account').each((entity, account) => {
		usernames[account.username] = entity;
	});
	const server = http.createServer();
	const wsm = WebSocketMessager(server);
	const em = ExpressMessager({ server, wsm });
	server.listen(3001, function () {
	});
	wsm.addConnectionHandler(function (ws) {
	})
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
	em.setHandler({
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
			return { entity: account.playerEntity, message: 'Login successful' }
		},
	});
	em.setHandler({
		name: 'toJson',
		handler: (ws, ...args) => {
			return registry.toJson();
		},
	});
	em.setHandler({
		name: 'create',
		handler: (ws, ...args) => {
			return registry.create();
		},
	});
	em.setHandler({
		name: 'emplace',
		handler: (ws, ...args) => {
			return registry.emplace(...args);
		},
	});
	em.setHandler({
		name: 'update',
		handler: (ws, ...args) => {
			return registry.update(...args);
		},
	});
	em.setHandler({
		name: 'erase',
		handler: (ws, ...args) => {
			return registry.erase(...args);
		},
	});
	em.setHandler({
		name: 'destroy',
		handler: (ws, ...args) => {
			return registry.destroy(...args);
		},
	});
}