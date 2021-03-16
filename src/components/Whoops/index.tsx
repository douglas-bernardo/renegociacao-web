import React from 'react';

import { Container } from './styles';

import logoWhoops from '../../assets/logoWhoops.svg';

interface WhoopsProps {
  errorCode?: number;
  errorMessage?: string;
}

const Whoops: React.FC<WhoopsProps> = ({ errorCode, errorMessage }) => {
  return (
    <Container>
      <img src={logoWhoops} alt="whoops" />
      <strong>{errorCode || 500}</strong>
      <h1>{errorMessage || 'Algo não deu certo :('}</h1>
    </Container>
  );
};

export default Whoops;
