import { useEffect, useState } from "react";
import Registry from "../scripts/Registry";
import WebSocketMessager from "../scripts/client/WebSocketMessager";
import NetworkedRegistry from "@/scripts/NetworkedRegistry";
import EntityView from "@/components/EntityView";

export default function ({ registry }) {
	const [entityElements, setEntityElements] = useState([]);
	useEffect(function () {
		const updateObserver = (registry, id) => {
			setEntityElements(registry.map((entity) => {
				return <EntityView key={entity} registry={registry} entity={entity} />;
			}));
		};
		// registry.addOnUpdateAny(updateObserver);
		return () => {
			// registry.removeOnUpdateAny(updateObserver);
		};
	}, []);

	return <div className='col grow'>
		<div className='row title'>
			Entities
		</div>
		<div className='col grow scroll-y'>
			<div className='row button' onClick={() => {
				registry.cmdCreate();
			}}>
				+
			</div>
			{
				entityElements
			}
		</div>
	</div>
}