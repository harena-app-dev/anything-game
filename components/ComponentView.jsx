import { useEffect, useState } from "react";
import WebSocketMessager from "../scripts/client/WebSocketMessager";
import NetworkedRegistry from "@/scripts/NetworkedRegistry";
import Expandable from "./Expandable";
import SkillAttributes from "./SkillAttributes";
export default function ({ entity, registry, type }) {
	// const [componentState, setComponentState] = useState(registry.get({ entity, type }));
	// useEffect(function () {
	// 	const updateObserver = (registry: Registry, id: number) => {
	// 		setEntityState(registry.get(entity));
	// 	};
	// 	registry.addOnUpdate(entity, updateObserver);
	// 	return () => {
	// 		registry.removeOnUpdate(entity, updateObserver);
	// 	};
	// }, []);
	return <Expandable expandableNode={()=>{null}}>
		{type}
	</Expandable>
}