import { ReactNode, useState } from "react";
export default function ({ children, expandableNode: createExpandableJSX }: { expandableNode: () => ReactNode, children: ReactNode }) {
	const [isExpanded, setIsExpanded] = useState(false);
	return <div className="col">
		<div className="button title col" onClick={(e) => {
			setIsExpanded(!isExpanded);
		}}>
			{children}
		</div>
		{isExpanded ? createExpandableJSX() : null}
	</div>
}