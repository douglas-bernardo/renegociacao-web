import styled, { css } from 'styled-components';

interface RoleTagProps {
  theme?:
    | 'role_admin'
    | 'role_gerente'
    | 'role_coordenador'
    | 'role_supervisor'
    | 'role_consultor';
}

const tagThemeVariations = {
  role_admin: css`
    background: #003379;
    color: #fff;
  `,
  role_gerente: css`
    background: #336299;
    color: #fff;
  `,
  role_coordenador: css`
    background: #6592b9;
    color: #fff;
  `,
  role_supervisor: css`
    background: #98c1d8;
    color: #fff;
  `,
  role_consultor: css`
    background: #caf0f8;
    color: #3c3c3c;
  `,
};

export const Container = styled.div<RoleTagProps>`
  padding: 5px;
  border-radius: 5px;

  ${props => tagThemeVariations[props.theme || 'role_consultor']}
`;
