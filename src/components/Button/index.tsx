import React, { ButtonHTMLAttributes } from 'react';

import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import Loader from 'react-loader-spinner';

import { Container } from './styles';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
};

const Button: React.FC<ButtonProps> = ({ children, loading, ...rest }) => (
  <Container type="button" {...rest}>
    {loading ? (
      <>
        <Loader type="Oval" color="#FFF" height={24} width={24} />
        <p>Carregando...</p>
      </>
    ) : (
      children
    )}
  </Container>
);

export default Button;
