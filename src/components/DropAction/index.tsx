import React, { useCallback, useRef, useState } from 'react';
import { FaClipboardCheck, FaTh, FaTimesCircle, FaUndo } from 'react-icons/fa';
import Select from 'react-select';

import { OutSideClick } from '../../hooks/outSideClick';

import { Container, DropActionContent } from './styles';

interface DropActionProps {
  situacao?: {};
}

const DropAction: React.FC<DropActionProps> = ({ situacao = {} }) => {
  const btnActionDropRef = useRef<HTMLButtonElement>(null);
  const [positionContent, setPositionContent] = useState(0);
  const { visible, setVisible, ref } = OutSideClick(false);

  const handleClickButton = useCallback(() => {
    if (btnActionDropRef.current) {
      setPositionContent(btnActionDropRef.current.getBoundingClientRect().top);
      console.log(btnActionDropRef.current.getBoundingClientRect().top);
    }
    setVisible(prevState => !prevState);
  }, [setVisible]);

  return (
    <Container ref={ref}>
      <button
        ref={btnActionDropRef}
        className="openDropAction"
        type="button"
        onClick={handleClickButton}
      >
        <FaTh />
        <span>Ações</span>
      </button>
      {visible && (
        <DropActionContent position={positionContent}>
          <span className="dropTitle">Finalizar Como:</span>
          <button className="btnDropAction" type="button">
            <FaClipboardCheck className="drop" />
            Retenção
          </button>
          <button className="btnDropAction" type="button">
            <FaUndo className="drop rev" />
            Reversão
          </button>
          <button className="btnDropAction" type="button">
            <FaTimesCircle className="drop cancel" />
            Cancelamento
          </button>
          <span className="dropTitle">Outros:</span>
          <div className="otherOptions">
            <Select options={situacao} />
          </div>
        </DropActionContent>
      )}
    </Container>
  );
};

export default DropAction;
