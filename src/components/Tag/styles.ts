import styled, { css } from 'styled-components';

interface ContainerProps {
  theme?: 'success' | 'warning' | 'info' | 'default';
}

const themeVariations = {
  default: css`
    background: #f0f0f0;
    color: #3c3c3c;
  `,
  info: css`
    background: #ffeb9c;
    color: #9c6500;
  `,
  success: css`
    background: #c6efce;
    color: #006100;
  `,
  warning: css`
    background: #ffc7ce;
    color: #9c0006;
  `,
  critical: css`
    background: #e67e22;
    color: #fff;
  `,
};

export const Container = styled.div<ContainerProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 230px;
  height: 26px;
  border-radius: 16px;
  padding: 0 8px;

  ${props => themeVariations[props.theme || 'default']}
`;
