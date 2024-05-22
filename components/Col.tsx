import * as React from 'react';
import './Col.css';

export default function Col({ 
	children = null,
	flex = "0"
}: { children?: React.ReactNode 
	flex?: string
}) {
  return <div className="col" style={{ flex }}
  >{children}</div>;
}