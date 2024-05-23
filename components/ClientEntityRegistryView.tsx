import ClientEntityRegistry from "@/scripts/client/ClientEntityRegistry";

export default function ({ clientEntityRegistry }: { clientEntityRegistry: ClientEntityRegistry }) {
	return <div className="col grow">
		<div className='row title'>
			Entities
		</div>
		<div className='col grow'>
			<div className='row button' onClick={() => {
				webSocketMessager.current?.send('createEntity');
			}}>
				+
			</div>
		</div>
	</div>;
} 