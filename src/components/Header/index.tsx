import React, { useCallback } from 'react';
import { FaBell, FaAngleDown, FaSignOutAlt } from 'react-icons/fa';

import { Link } from 'react-router-dom';
import userDefaultImage from '../../assets/user.svg';

import { OutSideClick } from '../../hooks/outSideClick';
import { useAuth } from '../../hooks/auth';

import {
  Container,
  Content,
  ProfileDropdownMenu,
  ProfileDropdownMenuContent,
} from './styles';

const Header: React.FC = ({ children }) => {
  const { visible, setVisible, ref } = OutSideClick(false);
  const { user, signOut } = useAuth();

  const handleClickButton = useCallback(() => {
    setVisible((prevState: boolean) => !prevState);
  }, [setVisible]);

  return (
    <Container>
      <div>{children}</div>
      <Content>
        <FaBell title="Notificações" />

        <ProfileDropdownMenu ref={ref}>
          <button type="button" onClick={handleClickButton}>
            <img src={userDefaultImage} alt={user.primeiro_nome} />
            <span>{user.primeiro_nome}</span>
            <FaAngleDown />
          </button>
          {visible && (
            <ProfileDropdownMenuContent>
              {/* <a href="/">
                <FaUser className="drop" />
                <span>Meu Perfil</span>
              </a>
              <a href="/">
                <FaInfoCircle className="drop" />
                <span>Meus dados</span>
              </a> */}
              <Link to="/" className="logout" title="Log out" onClick={signOut}>
                <FaSignOutAlt />
                Log out
              </Link>
            </ProfileDropdownMenuContent>
          )}
        </ProfileDropdownMenu>
      </Content>
    </Container>
  );
};

export default Header;
