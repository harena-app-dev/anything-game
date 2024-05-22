import * as React from 'react';
import './Row.css';

function Row({ children }: { children?: React.ReactNode }) {
  return <div className="row">{children}</div>;
}
Row.defaultProps = {
  children: null,
};
export default Row;
