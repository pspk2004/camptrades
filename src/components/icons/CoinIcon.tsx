import React from 'react';

interface CoinIconProps extends React.SVGProps<SVGSVGElement> {}

export const CoinIcon: React.FC<CoinIconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM9 8.25a.75.75 0 000 1.5h6a.75.75 0 000-1.5H9zM9 11.25a.75.75 0 000 1.5h.75v1.5a.75.75 0 001.5 0v-1.5h1.5v1.5a.75.75 0 001.5 0v-1.5h.75a.75.75 0 000-1.5H9z" clipRule="evenodd" />
  </svg>
);
