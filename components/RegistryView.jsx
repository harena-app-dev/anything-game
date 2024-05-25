import { useEffect, useState } from "react";
import EntityView from "@/components/EntityView";
export default function RegistryView ({ registry, size }) {
	const [entityElements, setEntityElements] = useState([]);
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
	const [width, setWidth] = useState(256);
	return <div className='row resizable' style={{ 
		width: width + 'px',
		}}>
		<div className='col grow' >
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
		<div className='col vertical-resizer'
			onMouseDown={(e) => {
				console.log(`onMouseDown`);
				const startX = e.clientX;
				const startWidth = width;
				const onMouseMove = (e) => {
					console.log(`onMouseMove`);
					const dx = e.clientX - startX;
					const newSize = startWidth + dx;
					setWidth(newSize);
				};
				const onMouseUp = () => {
					console.log(`onMouseUp`);
					document.removeEventListener('mousemove', onMouseMove);
					document.removeEventListener('mouseup', onMouseUp);
				};
				document.addEventListener('mousemove', onMouseMove);
				document.addEventListener('mouseup', onMouseUp);
			}}>
		</div>
	</div>
}