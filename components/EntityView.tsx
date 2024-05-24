import { useEffect, useState } from "react";
import WebSocketMessager from "../scripts/client/WebSocketMessager";
import ClientRegistry from "@/scripts/client/ClientRegistry";
import Registry from "@/scripts/Registry";
type Entity = number;
export default function ({ entity, registry }: { entity: Entity, registry: Registry}) {
	const [entityState, setEntityState] = useState(registry.get(entity));
	useEffect(function () {
		const updateObserver = (registry: Registry, id: number) => {
			setEntityState(registry.get(entity));
		};
		registry.addOnUpdate(entity, updateObserver);
		return () => {
			registry.removeOnUpdate(entity, updateObserver);
		};
	}, []);
	return <div>
		<div>
			{entity}: {JSON.stringify(entityState)}
		</div>
	</div>;
}