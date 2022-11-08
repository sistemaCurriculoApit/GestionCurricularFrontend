import React, { PropsWithChildren, useEffect, useState } from 'react';
import { fromEvent, Subscription } from 'rxjs';

const isLarge = (): boolean => window.matchMedia('(min-width: 1281px)').matches;

export const FilterWrapper: React.FC<PropsWithChildren<any>> = ({ children }) => {
  const [isLargeScreen, setIsLargeScreen] = useState<boolean>(isLarge());

  useEffect(() => {
    const subcription: Subscription = fromEvent(window, 'resize').subscribe((e) => {
      setIsLargeScreen(isLarge());
    });

    return () => subcription.unsubscribe();
  }, []);

  return (
    <div style={{
      display: 'flex',
      minWidth: isLargeScreen ? '40%' : '70%',
      justifyContent: 'space-around',
      flexWrap: 'wrap'
    }}>
      {children}
    </div>
  );
};