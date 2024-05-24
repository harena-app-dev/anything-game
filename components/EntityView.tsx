import { useEffect, useState } from "react";
import WebSocketMessager from "../scripts/client/WebSocketMessager";
import ClientRegistry from "@/scripts/client/ClientRegistry";
import Registry, { Entity } from "@/scripts/Registry";
import Attributes from "@/scripts/dnd/Attributes";
import Expandable from "./Expandable";
export default function ({ entity, registry }: { entity: Entity, registry: ClientRegistry }) {
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
		const str = JSON.stringify(entityState);
		if (entityState.skillAttributes === undefined) {
			return <div className="row">
				<div className="col grow text-wrap">
					{str}
				</div>
				<div className="col title button grow" onClick={() => {
					registry.addOnDestroy(entity);
				}}>
					create attributes
				</div>
			</div >
		}
		function createSkillAttributesNode() {
			return <div className="row text-wrap">
				{JSON.stringify(entityState.skillAttributes)}
			</div>
		}
		return <div className="col">
			<div className="row text-wrap">
				{str}
			</div>
			<Expandable createExpandableNode={createSkillAttributesNode}>
				<div className="row title">
					<div className="col">Attributes</div>
				</div>
			</Expandable>
		</div>
	};
	return <Expandable createExpandableNode={createExpandableNode}>
		{entity}
	</Expandable>
}