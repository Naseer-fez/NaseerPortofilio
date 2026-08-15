import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import NotFound from '@/app/not-found';

describe('NotFound Component (404 Page)', () => {
  it('renders container, card, and window header with traffic lights', () => {
    render(<NotFound />);

    expect(screen.getByTestId('not-found-container')).toBeInTheDocument();
    expect(screen.getByTestId('not-found-card')).toBeInTheDocument();
    expect(screen.getByTestId('not-found-window-header')).toBeInTheDocument();
    expect(screen.getByTestId('traffic-light-close')).toBeInTheDocument();
    expect(screen.getByTestId('traffic-light-minimize')).toBeInTheDocument();
    expect(screen.getByTestId('traffic-light-maximize')).toBeInTheDocument();
  });

  it('displays 404 error code and friendly message', () => {
    render(<NotFound />);

    const errorCode = screen.getByTestId('not-found-error-code');
    expect(errorCode).toBeInTheDocument();
    expect(errorCode).toHaveTextContent(/404/i);

    const title = screen.getByTestId('not-found-title');
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent(/Location Not Found/i);

    const message = screen.getByTestId('not-found-message');
    expect(message).toBeInTheDocument();
    expect(message.textContent).toContain('The requested application or path could not be located');
  });

  it('renders "Return to Desktop" button linking to "/"', () => {
    render(<NotFound />);

    const returnBtn = screen.getByTestId('return-to-desktop-btn');
    expect(returnBtn).toBeInTheDocument();
    expect(returnBtn).toHaveAttribute('href', '/');
    expect(returnBtn).toHaveTextContent(/Return to Desktop/i);
  });
});
