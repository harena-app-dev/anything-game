import * as React from 'react';
import './Col.css';

function Col({ children = null }: { children?: React.ReactNode }) {
  return <div className="col">{children}</div>;
}
// Col.defaultProps = {
//   children: null,
// };
export default Col;
