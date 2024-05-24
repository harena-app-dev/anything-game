import { useEffect, useState } from "react";
import Registry from "../scripts/Registry";
import WebSocketMessager from "../scripts/client/WebSocketMessager";
import ClientRegistry from "@/scripts/client/ClientRegistry";
import EntityView from "@/components/EntityView";

export default function ({ webSocketMessager: wsm }: { webSocketMessager: WebSocketMessager }) {
	const [registry, setRegistry] = useState(new ClientRegistry(wsm));
	useEffect(function () {
		wsm.addHandler('loadEntities', ({ data }: { data: string }) => {
		});
		wsm.addHandler('updateEntity', ({ id, data }) => {
		});
		wsm.addHandler('destroyEntity', ({ id }) => {
		});
	}, []);
	var entityElements: JSX.Element[] = [];
	registry.each((id, data) => {
		entityElements.push(<EntityView key={id} entity={id} registry={registry} />);
	});
	return <div className='row grow'>
		<div className='row title'>
			Entities
		</div>
		<div className='col grow'>
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