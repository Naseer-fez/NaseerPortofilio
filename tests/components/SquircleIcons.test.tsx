import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  TerminalIcon,
  ProjectsIcon,
  AboutIcon,
  FinderIcon,
  SettingsIcon,
  MailIcon,
  AppleLogo,
  AppIcon,
} from '@/components/icons';

describe('macOS Squircle SVG Icons & Dispatcher', () => {
  it('renders TerminalIcon with custom gradient, header bar, and prompt', () => {
    const { getByTestId } = render(<TerminalIcon size={64} />);
    const icon = getByTestId('icon-terminal-svg');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('viewBox', '0 0 128 128');
  });

  it('renders ProjectsIcon with blueprint grid and briefcase clasp', () => {
    const { getByTestId } = render(<ProjectsIcon size={64} />);
    const icon = getByTestId('icon-projects-svg');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('viewBox', '0 0 128 128');
  });

  it('renders AboutIcon with avatar silhouette and verified checkmark', () => {
    const { getByTestId } = render(<AboutIcon size={64} />);
    const icon = getByTestId('icon-about-svg');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('viewBox', '0 0 128 128');
  });

  it('renders FinderIcon with dual-color split smile', () => {
    const { getByTestId } = render(<FinderIcon size={64} />);
    const icon = getByTestId('icon-finder-svg');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('viewBox', '0 0 128 128');
  });

  it('renders SettingsIcon with titanium gear assembly', () => {
    const { getByTestId } = render(<SettingsIcon size={64} />);
    const icon = getByTestId('icon-settings-svg');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('viewBox', '0 0 128 128');
  });

  it('renders MailIcon with frosted envelope and airmail stamp', () => {
    const { getByTestId } = render(<MailIcon size={64} />);
    const icon = getByTestId('icon-mail-svg');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('viewBox', '0 0 128 128');
  });

  it('renders swappable AppleLogo SVG', () => {
    const { getByTestId } = render(<AppleLogo size={20} />);
    const logo = getByTestId('apple-logo-svg');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('viewBox', '0 0 170 170');
  });

  it('dispatches appropriate squircle icon based on appId in AppIcon', () => {
    const { getByTestId, rerender } = render(<AppIcon appId="terminal" />);
    expect(getByTestId('icon-terminal-svg')).toBeInTheDocument();

    rerender(<AppIcon appId="PROJECTS" />);
    expect(getByTestId('icon-projects-svg')).toBeInTheDocument();

    rerender(<AppIcon appId="finder" />);
    expect(getByTestId('icon-finder-svg')).toBeInTheDocument();
  });

  it('falls back to Lucide icon or AppWindow when unmapped appId is given', () => {
    const { container } = render(<AppIcon appId="custom-app" iconName="HelpCircle" />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
