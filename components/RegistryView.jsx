import { useEffect, useState } from "react";
import EntityView from "@/components/EntityView";

export default function ({ registry }) {
	const [entityElements, setEntityElements] = useState([]);
	console.log(`entityElements: ${entityElements}`);
	console.log(`entityElements: ${registry.map({
		callback: ({ entity }) => {
			return <EntityView key={entity} registry={registry} entity={entity} />;
		}
	})}`);
	useEffect(function () {
		console.log(`useEffect`);
		const observer = ({ entity }) => {
			setEntityElements((entityElements) => {
				return [...entityElements, <EntityView key={entity} registry={registry} entity={entity} />];
			});
		};
		registry.onCreate.connect(observer);
		return () => {
			registry.onCreate.disconnect(observer);
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