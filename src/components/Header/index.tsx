import React, { useCallback } from 'react';
import {
  FaBell,
  FaAngleDown,
  FaUser,
  FaInfoCircle,
  FaPowerOff,
} from 'react-icons/fa';

import { OutSideClick } from '../../hooks/outSideClick';

import {
  Container,
  Content,
  DropdownMenu,
  DropdownMenuContent,
} from './styles';

const Header: React.FC = ({ children }) => {
  const { visible, setVisible, ref } = OutSideClick(false);

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
            <img
              src="https://avatars.githubusercontent.com/u/29052049?s=400&u=ce9d2588cb52719d5c1a65217ff18c7e5c8ef804&v=4"
              alt="Douglas Bernardo"
            />
            <span>Admin</span>
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
