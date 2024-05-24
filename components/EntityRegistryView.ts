import { useEffect, useState } from "react";
import Registry from "../scripts/Registry";
import WebSocketMessager from "../scripts/client/WebSocketMessager";

export default function ({webSocketMessager}: {webSocketMessager: WebSocketMessager}) {
	const [entityRegistry, setEntityRegistry] = useState(new Registry());
	useEffect(function () {
		webSocketMessager.addHandler('loadEntities', ({data}: {data: string}) => {
			const newEntityRegistry = new Registry();
			newEntityRegistry.fromJson(data);
			setEntityRegistry(newEntityRegistry);
		});
		webSocketMessager.addHandler('updateEntity', ({id, data}) => {
		});
		webSocketMessager.addHandler('destroyEntity', ({id}) => {
		});
	}, []);
}