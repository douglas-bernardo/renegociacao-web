import React, { useCallback, useEffect, useState } from 'react';

import { Container } from './styles';

interface ToggleButtonProps {
  selected?: boolean;
  [key: string]: any;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({
  selected = false,
  onChange,
  ...props
}) => {
  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    setIsSelected(selected);
  }, [selected]);

  const toggleSelected = useCallback(() => {
    setIsSelected(!isSelected);
    onChange(props);
  }, [isSelected, onChange, props]);

  return (
    <Container
      isActive={isSelected}
      onClick={toggleSelected}
      onChange={() => onChange(props)}
    >
      <div className="dialog-button" />
    </Container>
  );
};

export default ToggleButton;
