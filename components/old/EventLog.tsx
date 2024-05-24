import WebSocketMessager from "@/scripts/client/WebSocketMessager";
import { useState } from "react";


export default function EventLog(webSocketMessager: WebSocketMessager) {
	const [messages, setMessages] = useState<string[]>([]);
	webSocketMessager.addHandler('EventLog', (data: string[]) => {
		setMessages(data);
	});
	return <div className='row grow'>

	</div>;
} 