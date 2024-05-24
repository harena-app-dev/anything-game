import { ReactNode, useState } from "react";
export default function ({ children, createExpandableNode: createExpandableJSX }: { createExpandableNode: () => ReactNode, children: ReactNode }) {
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