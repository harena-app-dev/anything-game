import { ReactNode, useEffect, useState } from "react";
import WebSocketMessager from "../scripts/client/WebSocketMessager";
import ClientRegistry from "@/scripts/client/ClientRegistry";
import Registry from "@/scripts/Registry";
import Attributes from "@/scripts/Attributes";
type Entity = number;
export default function ({ children, createExpandableJSX }: { createExpandableJSX: () => ReactNode, children: ReactNode }) {
	const [isExpanded, setIsExpanded] = useState(false);
	return <div className="col">
		<div className="expandable button col" onClick={(e) => {
			setIsExpanded(!isExpanded);
		}}>
			{children}
		</div>
		{isExpanded ? createExpandableJSX() : null}
	</div>
}