import { useEffect, useState } from "react";
import Registry from "../scripts/Registry";
import WebSocketMessager from "../scripts/client/WebSocketMessager";
import ClientRegistry from "@/scripts/client/ClientRegistry";
import EntityView from "@/components/EntityView";

export default function ({ registry }: { registry: ClientRegistry }) {
	const [entityElements, setEntityElements] = useState<JSX.Element[]>([]);
	useEffect(function () {
		const updateObserver = (registry: Registry, id: number) => {
			setEntityElements(registry.map((entity) => {
				console.log('entity', entity);
				return <EntityView key={entity} registry={registry} entity={entity} />;
			}));
		};
		registry.addOnUpdateAny(updateObserver);
		return () => {
			registry.removeOnUpdateAny(updateObserver);
		};
	}, []);

	return <div className='col grow'>
		<div className='row title'>
			Entities
		</div>
		<div className='col grow flex-scroll-y'>
			<div className='row button' onClick={() => {
				registry.sendCreate();
			}}>
				+
			</div>
			{
				entityElements
			}
		</div>
	</div>
}