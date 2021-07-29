import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  FaChartLine,
  FaComments,
  FaHandsHelping,
  FaSignOutAlt,
  FaCog,
} from 'react-icons/fa';

import { useAuth } from '../../hooks/auth';

import Can from '../Can';
import logo from '../../assets/logo_vacation.svg';
import { Aside } from './styles';

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
      <Link to="/">
        <img src={logo} className="logo" alt="Renegociação Web" />
      </Link>
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
      <Can roles={['ROLE_ADMIN', 'ROLE_GERENTE', 'ROLE_COORDENADOR']}>
        <ul className="adminLinks">
          <li>
            <NavLink to="/settings" activeClassName="active">
              <FaCog />
              Configurações
            </NavLink>
          </li>
        </ul>
      </Can>
      <button type="button" title="Log out" onClick={signOut}>
        <FaSignOutAlt />
        Log out
      </button>
    </Aside>
  );
};

export default Sidebar;
