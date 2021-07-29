import React, { ReactElement } from 'react';
import { FaAngleRight } from 'react-icons/fa';
import { v4 as uuid } from 'uuid';

import { Container } from './styles';

interface BreadCrumbProps {
  children: ReactElement[];
}

const BreadCrumb: React.FC<BreadCrumbProps> = ({ children }) => {
  return (
    <Container>
      {children.map((item, index) => (
        <div key={uuid()}>
          {item}
          {index < children.length - 1 && <FaAngleRight size={30} />}
        </div>
      ))}
    </Container>
  );
};

export default BreadCrumb;
