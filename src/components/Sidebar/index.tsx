import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaChartLine,
  FaComments,
  FaHandsHelping,
  FaSignOutAlt,
} from 'react-icons/fa';

import logoimg from '../../assets/logo_vacation.svg';

import { Aside } from './styles';

import { useAuth } from '../../hooks/auth';

interface Page {
  page: string;
  label: string;
  icon: Object;
}

const pages: Array<Page> = [
  { page: '/dashboard', label: 'Dashboard', icon: <FaChartLine /> },
  { page: '/occurrences', label: 'Ocorrências', icon: <FaComments /> },
  { page: '/negotiations', label: 'Negociações', icon: <FaHandsHelping /> },
];

const Sidebar: React.FC = () => {
  const { signOut } = useAuth();

  return (
    <Aside>
      <img src={logoimg} className="logo" alt="Renegociação Web" />
      <h1>Renegociação</h1>
      <ul>
        {pages.map(({ label, page, icon }) => (
          <li key={page}>
            <NavLink key={page} to={page} activeClassName="active">
              {icon}
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
      <hr />
      <button type="button" title="Log out" onClick={signOut}>
        <FaSignOutAlt />
        Log out
      </button>
    </Aside>
  );
};

export default Sidebar;
