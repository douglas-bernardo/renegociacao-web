import React from 'react';

import { Container } from './styles';

interface TagProps {
  children: string;
  theme?:
    | 'role_admin'
    | 'role_gerente'
    | 'role_coordenador'
    | 'role_supervisor'
    | 'role_consultor';
  className?: string;
}

const TagRoles: React.FC<TagProps> = ({ children, theme, className }) => {
  return (
    <Container className={className} theme={theme}>
      {children}
    </Container>
  );
};

export default TagRoles;
