import React from 'react';

import { Container } from './styles';

interface TabProps {
  title: string;
}

const Tab: React.FC<TabProps> = ({ children }) => {
  return <Container className="content">{children}</Container>;
};

export default Tab;
