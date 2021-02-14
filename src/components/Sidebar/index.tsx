import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaChartLine,
  FaComments,
  FaHandsHelping,
  FaSignOutAlt,
} from 'react-icons/fa';

import logoimg from '../../assets/logo_vacation.svg';

import { Aside } from './styles';

import { useAuth } from '../../hooks/auth';

const Sidebar: React.FC = () => {
  const { signOut } = useAuth();
  const items = [
    { page: 'dashboard', label: 'Dashboard', icom: <FaChartLine /> },
    { page: 'ocorrencias', label: 'Ocorrencias', icom: <FaComments /> },
    { page: 'negociacoes', label: 'Negociações', icom: <FaHandsHelping /> },
    { page: 'logout', label: 'Log out', icom: <FaSignOutAlt /> },
  ];

  return (
    <Aside isSelected>
      <img src={logoimg} className="logo" alt="RenegociacaoWeb" />

      <h1>Renegociação</h1>

      <ul>
        {items.map(({ label, page, icom }) => (
          <li
            key={page}
            className={
              window.location.pathname.replace('/', '') === page ? 'active' : ''
            }
          >
            {page === 'logout' ? (
              <button type="button" title="Deslogar" onClick={signOut}>
                {icom}
                {label}
              </button>
            ) : (
              <Link to={page}>
                {icom}
                {label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </Aside>
  );
};

export default Sidebar;
