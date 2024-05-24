import { useEffect, useState } from "react";
import WebSocketMessager from "../scripts/client/WebSocketMessager";
import ClientRegistry from "@/scripts/client/ClientRegistry";
import Registry from "@/scripts/Registry";
import Attributes from "@/scripts/Attributes";
import Expandable from "./Expandable";
type Entity = number;
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
	const [isExpanded, setIsExpanded] = useState(false);
	function createExpandableJSX() {
		return <div>
			<div className="row title">
				attributes
			</div>
		</div>
	};
	// const attributes = new Attributes();
	// console.log(JSON.stringify(attributes));
	// const attributes2 = JSON.parse(JSON.stringify(attributes)) as Attributes; 
	// console.log(`2:` + JSON.stringify(attributes2));
	// return <div className="expandable button col"
	// 	onClick={(e) => {
	// 		setIsExpanded(!isExpanded);
	// 	}}>
	// 	{entity}: {JSON.stringify(entityState)}
	// 	<div>
	// 		{isExpanded ? createExpandableJSX() : null}
	// 	</div>
	// </div>;
	return <Expandable createExpandableJSX={createExpandableJSX}>
		{entity}: {JSON.stringify(entityState)}
	</Expandable>
}