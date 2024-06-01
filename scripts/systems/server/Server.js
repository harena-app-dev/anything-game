import WebSocketMessager from "../../server/WebSocketMessager";
import ExpressMessager from "../../server/ExpressMessager";
import Log from "../../Log";
import http from 'http';

export default function (registry, systems) {
	const usernames = {};
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
		wsm.sendToAll('emplace', args);
	})
	registry.onUpdate().connect(function (...args) {
		wsm.sendToAll('update', args);
	})
	registry.onErase().connect(function (...args) {
		wsm.sendToAll('erase', args);
	})
	registry.onDestroy().connect(function (entity) {
		wsm.sendToAll('destroy', entity);
	})
	em.setHandler({
		name: 'login',
		handler: ({ username, password, isCreate }) => {
			if (isCreate) {
				if (usernames[username] !== undefined) {
					return { message: 'Username already exists' }
				}
				const entity = registry.create();
				const playerEntity = registry.create();
				registry.emplace('Sprite', playerEntity, { path: 'rogue.png' });
				registry.emplace('Account', entity, { username, password, playerEntity });
				usernames[username] = entity;
				return { entity: playerEntity, message: 'Account created' }
			}
			const entity = usernames[username];
			if (entity === undefined) {
				return { message: 'Invalid combination' }
			}
			const account = registry.get('Account', entity);
			if (account.password !== password) {
				return { message: 'Invalid combination' }
			}
			return { entity: account.playerEntity, message: 'Login successful' }
		},
	});
	em.setHandler({
		name: 'toJson',
		handler: () => {
			return registry.toJson();
		},
	});
	em.setHandler({
		name: 'create',
		handler: () => {
			return registry.create();
		},
	});
	em.setHandler({
		name: 'emplace',
		handler: (...args) => {
			return registry.emplace(...args);
		},
	});
	em.setHandler({
		name: 'update',
		handler: (...args) => {
			return registry.update(...args);
		},
	});
	em.setHandler({
		name: 'erase',
		handler: (...args) => {
			return registry.erase(...args);
		},
	});
	em.setHandler({
		name: 'destroy',
		handler: (entity) => {
			return registry.destroy(entity);
		},
	});
}