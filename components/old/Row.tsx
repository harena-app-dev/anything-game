import * as React from 'react';
import './Row.css';

function Row({ children = null }: { children?: React.ReactNode }) {
  return <div className="row">{children}</div>;
}
export default Row;
