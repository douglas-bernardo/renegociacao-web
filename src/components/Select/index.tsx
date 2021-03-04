import React, { useRef, useEffect, useState, useCallback } from 'react';
import ReactSelect, {
  OptionTypeBase,
  Props as SelectProps,
} from 'react-select';
import { useField } from '@unform/core';
import { FiAlertCircle } from 'react-icons/fi';

import { Container, Error } from './styles';

interface Props extends SelectProps<OptionTypeBase> {
  name: string;
}

const Select: React.FC<Props> = ({ name, ...rest }) => {
  const selectRef = useRef(null);

  const [isFocused, setIsFocused] = useState(false);
  const [isError, setIsError] = useState(false);
  const { fieldName, defaultValue, registerField, error } = useField(name);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
    setIsError(false);
  }, []);

  useEffect(() => {
    setIsError(!!error);
  }, [error]);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: selectRef.current,
      getValue: (ref: SelectProps) => {
        if (rest.isMulti) {
          if (!ref.state.value) {
            return [];
          }
          return ref.state.value.map((option: OptionTypeBase) => option.value);
        }
        if (!ref.state.value) {
          return '';
        }
        return ref.state.value.value;
      },
    });
  }, [fieldName, registerField, rest.isMulti]);

  return (
    <Container isErrored={!!error} isFocused={isFocused}>
      <ReactSelect
        onFocus={handleInputFocus}
        defaultValue={defaultValue}
        ref={selectRef}
        classNamePrefix="react-select"
        {...rest}
      />
      {isError && (
        <Error title={error}>
          <FiAlertCircle color="#c53030" size={20} />
        </Error>
      )}
    </Container>
  );
};

export default Select;
