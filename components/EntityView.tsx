import { useEffect, useState } from "react";
import WebSocketMessager from "../scripts/client/WebSocketMessager";
import ClientRegistry from "@/scripts/client/ClientRegistry";
type Entity = number;
export default function ({ entity, registry }: { entity: Entity, registry: ClientRegistry}) {
	const [entityState, setEntityState] = useState(null);
	useEffect(function () {
		const listener = (state: any) => {
			setEntityState(state);
		};
		registry.addEntityListener(entity, listener);
		return () => {
			registry.removeEntityListener(entity, listener);
		};
	}, []);
	return <div>
		<div>
			Entity {entity}: {entityState}
		</div>
	</div>;
}