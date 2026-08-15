import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';

const AllProviders = ({ children }: { children: React.ReactNode }) => {
  return <div id="root-portal">{children}</div>;
};

export const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
