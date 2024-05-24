// import { Button } from 'react-bootstrap';
import * as React from 'react';
import './Button.css';

function Button({
  children = null,
  ...props
}: {
  children?: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button onClick={props.onClick} type="button">
      {children}
    </button>
  );
}


export default Button;
