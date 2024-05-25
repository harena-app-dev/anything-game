import { useEffect, useState } from "react";
import WebSocketMessager from "../scripts/client/WebSocketMessager";
import NetworkedRegistry from "@/scripts/NetworkedRegistry";
import Expandable from "./Expandable";
import SkillAttributes from "./SkillAttributes";
import ComponentView from "./ComponentView";
export default function ({ entity, registry }) {
	// const [entityState, setEntityState] = useState(registry.get(entity));
	// useEffect(function () {
	// 	const updateObserver = (registry: Registry, id: number) => {
	// 		setEntityState(registry.get(entity));
	// 	};
	// 	registry.addOnUpdate(entity, updateObserver);
	// 	return () => {
	// 		registry.removeOnUpdate(entity, updateObserver);
	// 	};
	// }, []);
	// function createExpandableNode() {
	// 	const str = JSON.stringify(entityState, null, 2);
	// 	if (entityState.skillAttributes === undefined) {
	// 		return <div className="row">
	// 			<div className="col grow text-wrap">
	// 				{str}
	// 			</div>
	// 			<div className="col title button grow" onClick={() => {
	// 			}}>
	// 				create attributes
	// 			</div>
	// 		</div >
	// 	}
	// 	return <div className="col">
	// 		<pre className="row">
	// 			{str}
	// 		</pre>
	// 		<SkillAttributes entity={entity} registry={registry} />
	// 	</div>
	// };
	// return <Expandable expandableNode={createExpandableNode}>
	return <Expandable expandableNode={()=>{
		return <div className="col">
			<ComponentView entity={entity} registry={registry} type="Skills" />
			<ComponentView entity={entity} registry={registry} type="Integrity" />
		</div>
	}}>
		{entity}
	</Expandable>
}