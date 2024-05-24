import React from 'react';
import { Button } from 'react-bootstrap';

interface MainMenuButtonProps {
  label: string;
  onClick: () => void;
}
function MainMenuButton({ label, onClick }: MainMenuButtonProps) {
  return (
    <Button onClick={onClick} type="button">
      {label}
    </Button>
  );
}

export default MainMenuButton;
