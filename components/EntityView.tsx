import { useEffect, useState } from "react";
import WebSocketMessager from "../scripts/client/WebSocketMessager";
import ClientRegistry from "@/scripts/client/ClientRegistry";
import Registry, { Entity } from "@/scripts/Registry";
import Attributes from "@/scripts/Attributes";
import Expandable from "./Expandable";
export default function ({ entity, registry }: { entity: Entity, registry: Registry }) {
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
	function createExpandableNode() {
		return <div>
			<Expandable createExpandableNode={createExpandableNode}>
				<div className="row title">
					{entityState.attributes === undefined ? "no attributes" : <div className="col">Attributes</div>}
				</div>
			</Expandable>
		</div>
	};
	return <Expandable createExpandableNode={createExpandableNode}>
		{entity}: {JSON.stringify(entityState)}
	</Expandable>
}