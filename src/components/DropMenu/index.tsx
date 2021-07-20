import React, { ReactElement, useCallback, useRef, useState } from 'react';

import { HiDotsVertical } from 'react-icons/hi';

import { OutSideClick } from '../../hooks/outSideClick';

import { Container, DropActionContent } from './styles';

interface DropMenuProps {
  icon?: ReactElement;
  iconLabel?: string;
  className?: string;
}

const DropMenu: React.FC<DropMenuProps> = ({
  icon,
  iconLabel,
  children,
  className,
}) => {
  const btnActionDropRef = useRef<HTMLButtonElement>(null);
  const { visible, setVisible, ref } = OutSideClick(false);
  const [positionContent, setPositionContent] = useState(0);

  const handleClickButton = useCallback(() => {
    if (btnActionDropRef.current) {
      setPositionContent(btnActionDropRef.current.getBoundingClientRect().top);
    }
    setVisible((prevState: boolean) => !prevState);
  }, [setVisible]);

  return (
    <Container className={className} ref={ref}>
      <button
        ref={btnActionDropRef}
        className="openDropAction"
        type="button"
        onClick={handleClickButton}
      >
        {icon || <HiDotsVertical />}
        <span>{iconLabel || ''}</span>
      </button>
      {visible && (
        <DropActionContent position={positionContent}>
          {children}
        </DropActionContent>
      )}
    </Container>
  );
};

export default DropMenu;
