// import { Button } from 'react-bootstrap';
import * as React from 'react';
// import { useNavigate } from 'react-router-dom';
import { redirect } from 'next/navigation'
import Button from './Button';

function BackButton() {
//   const navigate = useNavigate();
  return (
    <Button onClick={() => redirect("/")}>
      <i className="bi bi-arrow-left" />
    </Button>
  );
}

export default BackButton;
