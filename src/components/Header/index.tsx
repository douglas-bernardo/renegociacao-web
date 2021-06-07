import React, { useCallback } from 'react';
import {
  FaBell,
  FaAngleDown,
  FaUser,
  FaInfoCircle,
  FaPowerOff,
} from 'react-icons/fa';

import userDefaultImage from '../../assets/user.svg';

import { OutSideClick } from '../../hooks/outSideClick';
import { useAuth } from '../../hooks/auth';

import {
  Container,
  Content,
  DropdownMenu,
  DropdownMenuContent,
} from './styles';

const Header: React.FC = ({ children }) => {
  const { visible, setVisible, ref } = OutSideClick(false);
  const { user } = useAuth();

  const handleClickButton = useCallback(() => {
    setVisible(prevState => !prevState);
  }, [setVisible]);

  return (
    <Container>
      <div>{children}</div>
      <Content>
        <FaBell title="Notificações" />

        <DropdownMenu ref={ref}>
          <button type="button" onClick={handleClickButton}>
            <img src={userDefaultImage} alt={user.primeiro_nome} />
            <span>{user.primeiro_nome}</span>
            <FaAngleDown />

            <DropdownMenuContent isVisible={visible}>
              <a href="/">
                <FaUser className="drop" />
                <span>Meu Pefil</span>
              </a>
              <a href="/">
                <FaInfoCircle className="drop" />
                <span>Meus dados</span>
              </a>
              <a href="/">
                <FaPowerOff className="drop" />
                <span>Sair</span>
              </a>
            </DropdownMenuContent>
          </button>
        </DropdownMenu>
      </Content>
    </Container>
  );
};

export default Header;
