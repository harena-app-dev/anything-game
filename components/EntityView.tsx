import { useEffect, useState } from "react";
import WebSocketMessager from "../scripts/client/WebSocketMessager";
type Entity = number;
export default function ({ entity, webSocketMessager }: { webSocketMessager: WebSocketMessager, entity: Entity }) {
	const [entityState, setEntityState] = useState(null);
	useEffect(function () {
		const updateHandler = ({ data }: { data: any }) => {
			setEntityState(data);
		};
		webSocketMessager.addHandler(`updateEntity/${entity}`, updateHandler);
		const destroyHandler = () => {
			setEntityState(null);
		};
		webSocketMessager.addHandler(`destroyEntity/${entity}`, destroyHandler);
		return function () {
			webSocketMessager.removeHandler(`updateEntity/${entity}`, updateHandler);
			webSocketMessager.removeHandler(`destroyEntity/${entity}`, destroyHandler);
		}
	});
	return <div>
		<div>
			Entity {entity}: {entityState}
		</div>
	</div>;
}