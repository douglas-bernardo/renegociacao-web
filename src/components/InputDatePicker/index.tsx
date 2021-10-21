import React, {
  useCallback,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from 'react';

import { format } from 'date-fns';
import DayPicker, { DayModifiers } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import { BiCalendar } from 'react-icons/bi';

import { OutSideClick } from '../../hooks/outSideClick';
import { dateMask } from '../Input/masks';
import { Container, DropCalendarContainer } from './styles';

export interface InputDatePickerHandles {
  selectedDate: Date;
  setError: (error: string) => void;
}

interface InputDatePickerProps {
  name: string;
  label: string;
  defaultDate?: Date;
  onChange?: (date: Date) => void;
}

const InputDatePicker: React.ForwardRefRenderFunction<
  InputDatePickerHandles,
  InputDatePickerProps
> = ({ name, label, defaultDate, onChange }, refInput) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { visible, setVisible, ref } = OutSideClick(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [error, setError] = useState<String | undefined>('');

  useEffect(() => {
    if (inputRef.current && defaultDate) {
      inputRef.current.value = format(defaultDate, 'dd/MM/yyyy');
      setSelectedDate(defaultDate);
    }
  }, [defaultDate]);

  useImperativeHandle(refInput, () => {
    return {
      selectedDate,
      setError,
    };
  });

  const handleClickInputDatePicker = useCallback(() => {
    setVisible((prevState: boolean) => !prevState);
  }, [setVisible]);

  const handleDateChange = useCallback(
    (date: Date, modifiers: DayModifiers) => {
      if (!modifiers.available && modifiers.disabled) return;
      if (inputRef.current) {
        setError('');
        setSelectedDate(date);
        setVisible((prevState: boolean) => !prevState);
        inputRef.current.value = format(date, 'dd/MM/yyyy');
      }

      if (typeof onChange === 'function') {
        onChange(date);
      }
    },
    [setVisible, onChange],
  );

  const handleInputDate = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setVisible(false);
      if (inputRef.current && e.currentTarget.value.length === 10) {
        inputRef.current.value = e.currentTarget.value;
        const parts = e.currentTarget.value.split('/');
        const year = parseInt(parts[2], 10);
        const mouth = parseInt(parts[1], 10);
        const day = parseInt(parts[0], 10);
        const newDate = new Date(year, mouth - 1, day);

        setSelectedDate(newDate);

        if (typeof onChange === 'function') {
          onChange(newDate);
        }
      }
    },
    [setVisible, onChange],
  );

  const handleKeyUp = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    dateMask(e);
  }, []);

  const handleEscape = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Escape') {
        if (inputRef.current && defaultDate) {
          inputRef.current.value = format(defaultDate, 'dd/MM/yyyy');
          setSelectedDate(defaultDate);
          setError('');
        }
      }
    },
    [defaultDate],
  );

  return (
    <Container ref={ref}>
      <label htmlFor={name}>
        {label}
        <input
          name={name}
          ref={inputRef}
          type="text"
          id={name}
          placeholder="dd/mm/aaaa"
          onClick={handleClickInputDatePicker}
          onChange={handleInputDate}
          onKeyUp={handleKeyUp}
          autoComplete="off"
          onKeyDown={handleEscape}
        />
        <BiCalendar />
      </label>
      {error && <span className="error">{error}</span>}
      {visible && (
        <DropCalendarContainer>
          <DayPicker
            weekdaysShort={['D', 'S', 'T', 'Q', 'Q', 'S', 'S']}
            onDayClick={handleDateChange}
            disabledDays={{ after: new Date() }}
            modifiers={{
              available: { before: new Date() },
            }}
            month={
              new Date(selectedDate.getFullYear(), selectedDate.getMonth())
            }
            selectedDays={selectedDate}
            months={[
              'Janeiro',
              'Fevereiro',
              'Março',
              'Abril',
              'Maio',
              'Junho',
              'Julho',
              'Agosto',
              'Setembro',
              'Outubro',
              'Novembro',
              'Dezembro',
            ]}
          />
        </DropCalendarContainer>
      )}
    </Container>
  );
};

export default forwardRef(InputDatePicker);
