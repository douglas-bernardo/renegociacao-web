import styled from 'styled-components';
import { shade } from 'polished';

export const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;

  span {
    color: #c53030;
  }

  label {
    position: relative;
    margin-right: 20px;

    svg {
      position: absolute;
      right: 6px;
      top: 50%;
      transform: translateY(-50%);
    }
  }

  input {
    width: 120px;
    border: 0;
    border-bottom: 1px solid #e5e5e5;
    height: 34px;
    padding: 5px;
    font-size: 14px;
    margin-left: 10px;
  }
`;

export const DropCalendarContainer = styled.div`
  position: absolute;
  top: 40px;
  /* display: flex;
  flex-direction: column; */

  padding: 10px;
  /* width: 250px; */
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 5px;
  box-shadow: rgb(0 0 0 / 40%) 0px 2px 5px;

  z-index: 1;
  transition: opacity 0.2s ease 0s, visibility 0.2s ease 0s;
  opacity: 1;

  .DayPicker {
    border-radius: 10px;
  }

  .DayPicker-wrapper {
    padding-bottom: 0;
    background: #fff;
    border-radius: 10px;
  }

  .DayPicker,
  .DayPicker-Month {
    width: 100%;
  }

  .DayPicker-NavButton {
    color: #999591 !important;
  }

  .DayPicker-NavButton--prev {
    right: auto;
    left: 1.5em;
    margin-right: 0;
  }

  /* .DayPicker-Month {
    border-collapse: separate;
    border-spacing: 8px;
    margin: 16px 0 0 0;
    padding: 16px;
    background-color: #28262e;
    border-radius: 0 0 10px 10px;
  } */

  .DayPicker-Caption {
    margin-bottom: 1em;
    padding: 0 1em;
    > div {
      text-align: center;
    }
  }

  .DayPicker--interactionDisabled .DayPicker-Day {
    cursor: pointer;
  }

  /* .DayPicker-Day--available:not(.DayPicker-Day--outside) {
    background: #3e3b47;
    border-radius: 10px;
    color: #fff;
  } */

  /* .DayPicker:not(.DayPicker--interactionDisabled)
    .DayPicker-Day:not(.DayPicker-Day--disabled):not(.DayPicker-Day--selected):not(.DayPicker-Day--outside):hover {
    background: ${shade(0.2, '#3e3b47')};
  } */

  .DayPicker-Day--today {
    font-weight: normal;
  }

  .DayPicker-Day--disabled {
    color: #666360 !important;
    background: transparent !important;
  }

  .DayPicker-Day--selected {
    background: #003379 !important;
    color: #fff !important;
  }
`;
