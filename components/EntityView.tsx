import { useEffect, useState } from "react";
import WebSocketMessager from "../scripts/client/WebSocketMessager";
import ClientRegistry from "@/scripts/client/ClientRegistry";
type Entity = number;
export default function ({ entity, registry }: { entity: Entity, registry: ClientRegistry}) {
	const [entityState, setEntityState] = useState(registry.get(entity));
	useEffect(function () {
		const listener = (state: any) => {
			setEntityState(state);
		};
		registry.observe(entity, listener);
		return () => {
			registry.unobserve(entity, listener);
		};
	}, []);
	return <div>
		<div>
			{entity}: {JSON.stringify(entityState)}
		</div>
	</div>;
}