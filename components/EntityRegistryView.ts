import { useEffect, useState } from "react";
import EntityRegistry from "../scripts/EntityRegistry";
import WebSocketMessager from "../scripts/client/WebSocketMessager";

export default function ({webSocketMessager}: {webSocketMessager: WebSocketMessager}) {
	const [entityRegistry, setEntityRegistry] = useState(new EntityRegistry());
	useEffect(function () {
		webSocketMessager.addHandler('loadEntities', ({data}: {data: string}) => {
			const newEntityRegistry = new EntityRegistry();
			newEntityRegistry.fromJson(data);
			setEntityRegistry(newEntityRegistry);
		});
		webSocketMessager.addHandler('updateEntity', ({id, data}) => {
		});
		webSocketMessager.addHandler('destroyEntity', ({id}) => {
		});
	}, []);
}