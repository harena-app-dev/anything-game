// import { Button } from 'react-bootstrap';
import * as React from 'react';
import './Button.css';

function Button({
  children,
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

Button.defaultProps = {
  children: null,
  onClick: () => {},
};

export default Button;
