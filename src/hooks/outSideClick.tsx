/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useState, useRef, useEffect } from 'react';

export const OutSideClick = (initialValue: boolean) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState<boolean>(initialValue);

  const handleClickOutside = (event: any) => {
    if (!ref.current?.contains(event.target)) setVisible(false);
  };

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Escape') setVisible(false);
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyPress, true);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyPress, true);
    };
  }, [ref]);
  return { visible, setVisible, ref };
};
