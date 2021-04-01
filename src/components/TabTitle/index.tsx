import React, { useCallback } from 'react';

import { Container } from './styles';

interface TabTitleProps {
  active: boolean;
  title: string;
  index: number;
  toggleTabIndex: (index: number) => void;
}

const TabTitle: React.FC<TabTitleProps> = ({
  active,
  title,
  index,
  toggleTabIndex,
}) => {
  const onClick = useCallback(() => {
    toggleTabIndex(index);
  }, [toggleTabIndex, index]);

  return (
    <Container className={active ? 'tab-item active-tab' : 'tab-item'}>
      <button type="button" onClick={onClick}>
        {title}
      </button>
    </Container>
  );
};

export default TabTitle;
