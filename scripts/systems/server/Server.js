import WebSocketMessager from "../../server/WebSocketMessager";
import ExpressMessager from "../../server/ExpressMessager";
import Log from "../../Log";
export default function (registry, systems) {
	const usernames = {};
	registry.view('Account').each((entity, account) => {
		usernames[account.username] = entity;
	});
	const system = {
		wsm: WebSocketMessager({ port: 3001 }),
		em: ExpressMessager({ port: 3002 }),
	}
	system.wsm.addConnectionHandler(function (ws) {
	})
	// registry.onEmplace().connect(function (type, entity, component) {
	// 	system.wsm.sendToAll("update", [type, entity, component])
	// })
	// registry.onUpdate().connect(function (type, entity, component) {
	// 	system.wsm.sendToAll("update", [type, entity, component])
	// })
	// registry.onErase().connect(function (type, entity, component) {
	// 	system.wsm.sendToAll("erase", [type, entity, component])
	// })
	// registry.onDestroy().connect(function (entity) {
	// 	system.wsm.sendToAll("destroy", [entity])
	// })
	registry.onEmplace().connect(function (...args) {
		system.wsm.sendToAll('emplace', args);
	})
	registry.onUpdate().connect(function (...args) {
		system.wsm.sendToAll('update', args);
	})
	registry.onErase().connect(function (...args) {
		system.wsm.sendToAll('erase', args);
	})
	registry.onDestroy().connect(function (entity) {
		system.wsm.sendToAll('destroy', entity);
	})
	system.em.setHandler({
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
	system.em.setHandler({
		name: 'toJson',
		handler: () => {
			return registry.toJson();
		},
	});
	system.em.setHandler({
		name: 'create',
		handler: () => {
			return registry.create();
		},
	});
	system.em.setHandler({
		name: 'emplace',
		handler: (...args) => {
			return registry.emplace(...args);
		},
	});
	system.em.setHandler({
		name: 'update',
		handler: (...args) => {
			return registry.update(...args);
		},
	});
	system.em.setHandler({
		name: 'erase',
		handler: (...args) => {
			return registry.erase(...args);
		},
	});
	system.em.setHandler({
		name: 'destroy',
		handler: (entity) => {
			return registry.destroy(entity);
		},
	});
	return system
}