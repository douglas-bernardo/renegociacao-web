import React, {
  InputHTMLAttributes,
  useEffect,
  useRef,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from 'react';

import { IconBaseProps } from 'react-icons';
import { FiAlertCircle } from 'react-icons/fi';
import { useField } from '@unform/core';

import { Container, Error } from './styles';
import { cep, currency, cpf, number, dateMask, toUpper } from './masks';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  containerStyle?: object;
  mask?: 'cep' | 'currency' | 'cpf' | 'number' | 'date' | 'toUpper';
  prefix?: string;
  autoComplete?: 'on' | 'off' | undefined;
  icon?: React.ComponentType<IconBaseProps>;
}

export interface InputHandles {
  inputValue: string | undefined;
}

const Input: React.ForwardRefRenderFunction<InputHandles, InputProps> = (
  { name, containerStyle = {}, mask, autoComplete, icon: Icon, ...rest },
  refInput,
) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  const { fieldName, defaultValue, error, registerField } = useField(name);

  useImperativeHandle(refInput, () => {
    return { inputValue: inputRef.current?.value };
  });

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);
    setIsFilled(!!inputRef.current?.value);
  }, []);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
    });
  }, [fieldName, registerField]);

  const handleKeyUp = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      if (mask === 'cep') {
        cep(e);
      }
      if (mask === 'currency') {
        currency(e);
      }
      if (mask === 'cpf') {
        cpf(e);
      }
      if (mask === 'number') {
        number(e);
      }
      if (mask === 'date') {
        dateMask(e);
      }
      if (mask === 'toUpper') {
        toUpper(e);
      }
    },
    [mask],
  );

  return (
    <Container
      style={containerStyle}
      isErrored={!!error}
      isFilled={isFilled}
      isFocused={isFocused}
      data-testid="input-container"
    >
      {Icon && <Icon size={20} />}
      <input
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        defaultValue={defaultValue}
        ref={inputRef}
        onKeyUp={handleKeyUp}
        autoComplete={autoComplete}
        {...rest}
      />
      {error && (
        <Error className="logoErrorInput" title={error}>
          <FiAlertCircle color="#c53030" size={20} />
        </Error>
      )}
    </Container>
  );
};

export default forwardRef(Input);
