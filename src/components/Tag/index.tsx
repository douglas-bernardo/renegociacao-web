import React from 'react';

import { Container } from './styles';

interface TagProps {
  children: string;
  theme?: 'success' | 'warning' | 'info' | 'default';
  className?: string;
}

const Tag: React.FC<TagProps> = ({ children, theme, className }) => {
  return (
    <Container className={className} theme={theme}>
      {children}
    </Container>
  );
};

export default Tag;
