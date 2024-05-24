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
	function createAttributesNode() {
		const skillAttributes = entityState.skillAttributes;
		return <div className="col">
			{Object.keys(skillAttributes).map((key) => {
				console.log(key);
				return <div className="row" key={key}>
					<div className="col grow">{key}</div>
					<div className="col button square-text">+</div>
					<div className="col">{skillAttributes[key]}</div>
					<div className="col button square-text">-</div>
				</div>
			})}
		</div>
	}
	return <Expandable expandableNode={createAttributesNode}>
		Skill Attributes
	</Expandable>
}