import { ReactNode, useState } from "react";
export default function ({ children, expandableNode: createExpandableJSX }: { expandableNode: () => ReactNode, children: ReactNode }) {
	const [isExpanded, setIsExpanded] = useState(false);
	return <div className="col expandable">
		<div className="button title row" onClick={(e) => {
			setIsExpanded(!isExpanded);
		}}>
			<div className="col">
				{children}
			</div>
			<div className="col ms-auto">
				{isExpanded ? "▲" : "▼"}
			</div>
		</div>
		{isExpanded ? createExpandableJSX() : null}
	</div>
}