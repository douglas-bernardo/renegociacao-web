/* eslint-disable react/no-array-index-key */
import React, { ReactElement, useCallback, useState } from 'react';
import TabTitle from '../TabTitle';

import { Container } from './styles';

interface TabsProps {
  children: ReactElement[];
}

const Tabs: React.FC<TabsProps> = ({ children }) => {
  const [tabIndex, setTabIndex] = useState(0);

  const toggleTabIndex = useCallback((index: number) => {
    setTabIndex(index);
  }, []);

  return (
    <Container>
      <div className="tabs">
        {children.map((item, index) => (
          <TabTitle
            active={tabIndex === index}
            key={index}
            title={item.props.title}
            index={index}
            toggleTabIndex={toggleTabIndex}
          />
        ))}
      </div>

      <div className="tab-content">{children[tabIndex]}</div>
      {/* <div className={tabIndex === index ? 'tab-item active-tab' : 'tab-item'}>{children}</div> */}
    </Container>
  );
};

export default Tabs;
