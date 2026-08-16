import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { TerminalApp } from '@/components/apps/TerminalApp';
import { ProjectsApp } from '@/components/apps/ProjectsApp';
import { AboutApp } from '@/components/apps/AboutApp';
import { FinderApp } from '@/components/apps/FinderApp';
import { SettingsApp } from '@/components/apps/SettingsApp';
import { MailApp } from '@/components/apps/MailApp';
import { useOSStore } from '@/hooks/useOSStore';
import { PROFILE_DATA } from '@/data/profile';
import { PROJECTS } from '@/data/projects';

describe('Applications Suite: 6 macOS Interactive Applications', () => {
  beforeEach(() => {
    // Reset window state
    const windows = useOSStore.getState().windows;
    Object.keys(windows).forEach(k => {
      useOSStore.getState().closeWindow(k);
    });
  });

  /* -------------------------------------------------------------------------- */
  /* 1. TerminalApp Tests                                                       */
  /* -------------------------------------------------------------------------- */
  describe('TerminalApp', () => {
    it('renders terminal container, prompt, and initial neofetch banner', () => {
      render(<TerminalApp />);

      expect(screen.getByTestId('terminal-app')).toBeInTheDocument();
      expect(screen.getByTestId('terminal-prompt')).toBeInTheDocument();
      expect(screen.getByTestId('terminal-input')).toBeInTheDocument();
      expect(screen.getByTestId('neofetch-banner')).toBeInTheDocument();
      expect(screen.getByText(/portfolio-os/i)).toBeInTheDocument();
    });

    it('executes "help" command and renders available commands list', () => {
      render(<TerminalApp />);
      const input = screen.getByTestId('terminal-input');

      fireEvent.change(input, { target: { value: 'help' } });
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

      expect(screen.getByText(/Available commands:/i)).toBeInTheDocument();
      expect(screen.getByText(/Developer bio/i)).toBeInTheDocument();
    });

    it('executes "about", "projects", and "skills" commands', () => {
      render(<TerminalApp />);
      const input = screen.getByTestId('terminal-input');

      // about
      fireEvent.change(input, { target: { value: 'about' } });
      fireEvent.keyDown(input, { key: 'Enter' });
      expect(screen.getByText(new RegExp(PROFILE_DATA.name, 'i'))).toBeInTheDocument();

      // projects
      fireEvent.change(input, { target: { value: 'projects' } });
      fireEvent.keyDown(input, { key: 'Enter' });
      expect(screen.getByText(/Featured Portfolio Projects:/i)).toBeInTheDocument();

      // skills
      fireEvent.change(input, { target: { value: 'skills' } });
      fireEvent.keyDown(input, { key: 'Enter' });
      expect(screen.getByText(new RegExp(PROFILE_DATA.skillCategories[0].name, 'i'))).toBeInTheDocument();
    });

    it('executes "theme dark" and "theme light" commands', () => {
      render(<TerminalApp />);
      const input = screen.getByTestId('terminal-input');

      fireEvent.change(input, { target: { value: 'theme light' } });
      fireEvent.keyDown(input, { key: 'Enter' });

      expect(useOSStore.getState().theme).toBe('light');
      expect(screen.getByText(/Theme switched to light/i)).toBeInTheDocument();
    });

    it('executes "contact" command and triggers openWindow("mail")', () => {
      render(<TerminalApp />);
      const input = screen.getByTestId('terminal-input');

      fireEvent.change(input, { target: { value: 'contact' } });
      fireEvent.keyDown(input, { key: 'Enter' });

      expect(useOSStore.getState().windows['mail'].isOpen).toBe(true);
      expect(screen.getByText(/Opening Mail Application.../i)).toBeInTheDocument();
    });

    it('executes "cat resume.txt" and "sudo" commands', () => {
      render(<TerminalApp />);
      const input = screen.getByTestId('terminal-input');

      // cat
      fireEvent.change(input, { target: { value: 'cat resume.txt' } });
      fireEvent.keyDown(input, { key: 'Enter' });
      expect(screen.getByText(new RegExp(PROFILE_DATA.name, 'i'))).toBeInTheDocument();

      // sudo
      fireEvent.change(input, { target: { value: 'sudo rm -rf /' } });
      fireEvent.keyDown(input, { key: 'Enter' });
      expect(screen.getByText(/Permission denied: Incident reported to Santa Claus/i)).toBeInTheDocument();
    });

    it('supports command history navigation with ArrowUp / ArrowDown', () => {
      render(<TerminalApp />);
      const input = screen.getByTestId('terminal-input');

      fireEvent.change(input, { target: { value: 'date' } });
      fireEvent.keyDown(input, { key: 'Enter' });

      fireEvent.change(input, { target: { value: 'skills' } });
      fireEvent.keyDown(input, { key: 'Enter' });

      // Navigate history up
      fireEvent.keyDown(input, { key: 'ArrowUp' });
      expect((input as HTMLInputElement).value).toBe('skills');

      fireEvent.keyDown(input, { key: 'ArrowUp' });
      expect((input as HTMLInputElement).value).toBe('date');

      // Navigate history down
      fireEvent.keyDown(input, { key: 'ArrowDown' });
      expect((input as HTMLInputElement).value).toBe('skills');
    });

    it('supports tab completion for command names', () => {
      render(<TerminalApp />);
      const input = screen.getByTestId('terminal-input');

      fireEvent.change(input, { target: { value: 'neo' } });
      fireEvent.keyDown(input, { key: 'Tab' });

      expect((input as HTMLInputElement).value).toBe('neofetch');
    });

    it('enters matrix rain canvas mode and exits on click', () => {
      render(<TerminalApp />);
      const input = screen.getByTestId('terminal-input');

      fireEvent.change(input, { target: { value: 'matrix' } });
      fireEvent.keyDown(input, { key: 'Enter' });

      const matrixOverlay = screen.getByTestId('terminal-matrix-canvas');
      expect(matrixOverlay).toBeInTheDocument();

      // Click to exit matrix mode
      fireEvent.click(matrixOverlay);
      expect(screen.queryByTestId('terminal-matrix-canvas')).not.toBeInTheDocument();
    });

    it('clears screen on "clear" command', () => {
      render(<TerminalApp />);
      const input = screen.getByTestId('terminal-input');

      fireEvent.change(input, { target: { value: 'help' } });
      fireEvent.keyDown(input, { key: 'Enter' });
      expect(screen.getByText(/Available commands:/i)).toBeInTheDocument();

      fireEvent.change(input, { target: { value: 'clear' } });
      fireEvent.keyDown(input, { key: 'Enter' });

      expect(screen.queryByText(/Available commands:/i)).not.toBeInTheDocument();
    });
  });

  /* -------------------------------------------------------------------------- */
  /* 2. ProjectsApp Tests                                                       */
  /* -------------------------------------------------------------------------- */
  describe('ProjectsApp', () => {
    it('renders project gallery with project cards and filter pills', () => {
      render(<ProjectsApp />);

      expect(screen.getByTestId('projects-app')).toBeInTheDocument();
      expect(screen.getByTestId('project-filter-all')).toBeInTheDocument();
      expect(screen.getByTestId('project-filter-full-stack')).toBeInTheDocument();
      expect(screen.getByTestId('project-filter-systems')).toBeInTheDocument();
      expect(screen.getByTestId('project-filter-creative')).toBeInTheDocument();

      PROJECTS.forEach(project => {
        expect(screen.getByTestId(`project-card-${project.id}`)).toBeInTheDocument();
      });
    });

    it('filters projects by category pill selection', () => {
      render(<ProjectsApp />);

      fireEvent.click(screen.getByTestId('project-filter-systems'));

      const systemsProjects = PROJECTS.filter(p => p.category === 'Systems');
      const otherProjects = PROJECTS.filter(p => p.category !== 'Systems');

      systemsProjects.forEach(p => {
        expect(screen.getByTestId(`project-card-${p.id}`)).toBeInTheDocument();
      });

      otherProjects.forEach(p => {
        expect(screen.queryByTestId(`project-card-${p.id}`)).not.toBeInTheDocument();
      });
    });

    it('filters projects by real-time search query', () => {
      render(<ProjectsApp />);
      const searchInput = screen.getByTestId('project-search-input');

      fireEvent.change(searchInput, { target: { value: 'NasCloud' } });

      expect(screen.getByTestId('project-card-nascloud')).toBeInTheDocument();
      expect(screen.queryByTestId('project-card-portfolio-os')).not.toBeInTheDocument();
    });

    it('opens project detail modal when card is clicked and closes on dismiss button', () => {
      render(<ProjectsApp />);

      fireEvent.click(screen.getByTestId('project-card-nascloud'));

      const modal = screen.getByTestId('project-modal');
      expect(modal).toBeInTheDocument();
      expect(screen.getByText(/Key Performance Metrics/i)).toBeInTheDocument();
      expect(screen.getByText(/Engineering Highlights/i)).toBeInTheDocument();

      fireEvent.click(screen.getByTestId('project-modal-close'));
      expect(screen.queryByTestId('project-modal')).not.toBeInTheDocument();
    });
  });

  /* -------------------------------------------------------------------------- */
  /* 3. AboutApp Tests                                                          */
  /* -------------------------------------------------------------------------- */
  describe('AboutApp', () => {
    it('renders profile overview tab by default with stats and bio', () => {
      render(<AboutApp />);

      expect(screen.getByTestId('about-app')).toBeInTheDocument();
      expect(screen.getByTestId('about-tab-overview')).toBeInTheDocument();
      expect(screen.getByTestId('about-tab-timeline')).toBeInTheDocument();
      expect(screen.getByTestId('about-tab-skills')).toBeInTheDocument();
      expect(screen.getByTestId('about-tab-resume')).toBeInTheDocument();

      expect(screen.getByText(new RegExp(PROFILE_DATA.name, 'i'))).toBeInTheDocument();
      expect(screen.getByText(/Biography & Philosophy/i)).toBeInTheDocument();
    });

    it('switches to timeline tab and renders milestone nodes', () => {
      render(<AboutApp />);

      fireEvent.click(screen.getByTestId('about-tab-timeline'));

      expect(screen.getByText(new RegExp(PROFILE_DATA.timeline[0].role, 'i'))).toBeInTheDocument();
      expect(screen.getByText(/Departmental Coding Club/i)).toBeInTheDocument();
    });

    it('switches to skills matrix tab and renders animated progress bars', () => {
      render(<AboutApp />);

      fireEvent.click(screen.getByTestId('about-tab-skills'));

      expect(screen.getByText(new RegExp(PROFILE_DATA.skillCategories[0].name, 'i'))).toBeInTheDocument();
      const firstSkill = PROFILE_DATA.skillCategories[0].skills[0];
      const testId = `skills-progress-bar-${firstSkill.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
      expect(screen.getByTestId(testId)).toBeInTheDocument();
    });

    it('switches to resume document tab', () => {
      render(<AboutApp />);

      fireEvent.click(screen.getByTestId('about-tab-resume'));

      expect(screen.getByText(/Executive Summary/i)).toBeInTheDocument();
      expect(screen.getByText(/Download Resume \(PDF\)/i)).toBeInTheDocument();
    });

    it('opens mail app when Contact Me button is clicked', () => {
      render(<AboutApp />);

      fireEvent.click(screen.getByTestId('about-contact-btn'));
      expect(useOSStore.getState().windows['mail'].isOpen).toBe(true);
    });
  });

  /* -------------------------------------------------------------------------- */
  /* 4. FinderApp Tests                                                         */
  /* -------------------------------------------------------------------------- */
  describe('FinderApp', () => {
    it('renders Finder sidebar, toolbar, and Applications folder by default', () => {
      render(<FinderApp />);

      expect(screen.getByTestId('finder-app')).toBeInTheDocument();
      expect(screen.getByTestId('finder-sidebar')).toBeInTheDocument();
      expect(screen.getByTestId('finder-sidebar-apps')).toBeInTheDocument();
      expect(screen.getByTestId('finder-sidebar-docs')).toBeInTheDocument();
      expect(screen.getByTestId('finder-sidebar-pics')).toBeInTheDocument();
      expect(screen.getByTestId('finder-sidebar-downloads')).toBeInTheDocument();

      expect(screen.getByTestId('finder-item-app-terminal')).toBeInTheDocument();
      expect(screen.getByTestId('finder-item-app-projects')).toBeInTheDocument();
    });

    it('navigates to Documents folder when clicked in sidebar', () => {
      render(<FinderApp />);

      fireEvent.click(screen.getByTestId('finder-sidebar-docs'));

      expect(screen.getByTestId('finder-item-doc-resume')).toBeInTheDocument();
      expect(screen.getByTestId('finder-item-doc-arch-notes')).toBeInTheDocument();
    });

    it('toggles between Grid and List view modes', () => {
      render(<FinderApp />);

      fireEvent.click(screen.getByTestId('finder-view-list-btn'));
      expect(screen.getByText(/Date Modified/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Kind/i).length).toBeGreaterThan(0);

      fireEvent.click(screen.getByTestId('finder-view-grid-btn'));
      expect(screen.queryByText(/Date Modified/i)).not.toBeInTheDocument();
    });

    it('populates preview pane on file selection and opens app on double click', () => {
      render(<FinderApp />);

      const terminalItem = screen.getByTestId('finder-item-app-terminal');
      fireEvent.click(terminalItem);

      expect(screen.getByTestId('finder-preview-pane')).toBeInTheDocument();
      expect(screen.getAllByText(/Executable application bundle for Portfolio OS Terminal/i).length).toBeGreaterThan(0);

      fireEvent.doubleClick(terminalItem);
      expect(useOSStore.getState().windows['terminal'].isOpen).toBe(true);
    });
  });

  /* -------------------------------------------------------------------------- */
  /* 5. SettingsApp Tests                                                       */
  /* -------------------------------------------------------------------------- */
  describe('SettingsApp', () => {
    it('renders wallpaper picker by default and swaps wallpaper on click', () => {
      render(<SettingsApp />);

      expect(screen.getByTestId('settings-app')).toBeInTheDocument();
      expect(screen.getByTestId('settings-nav-wallpaper')).toBeInTheDocument();
      expect(screen.getByTestId('settings-wallpaper-sonoma-dark')).toBeInTheDocument();

      fireEvent.click(screen.getByTestId('settings-wallpaper-cyberpunk-neon'));
      expect(useOSStore.getState().wallpaperId).toBe('cyberpunk-neon');
    });

    it('navigates to Appearance section and changes theme', () => {
      render(<SettingsApp />);

      fireEvent.click(screen.getByTestId('settings-nav-appearance'));
      expect(screen.getByTestId('settings-theme-dark')).toBeInTheDocument();
      expect(screen.getByTestId('settings-theme-light')).toBeInTheDocument();

      fireEvent.click(screen.getByTestId('settings-theme-light'));
      expect(useOSStore.getState().theme).toBe('light');
    });

    it('navigates to Sound section and toggles sound FX', () => {
      render(<SettingsApp />);

      fireEvent.click(screen.getByTestId('settings-nav-sound'));
      const soundToggle = screen.getByTestId('settings-sound-toggle');

      fireEvent.click(soundToggle);
      expect(useOSStore.getState().soundEnabled).toBe(false);

      fireEvent.click(soundToggle);
      expect(useOSStore.getState().soundEnabled).toBe(true);
    });

    it('navigates to Displays section and toggles ambient hero mode', () => {
      render(<SettingsApp />);

      fireEvent.click(screen.getByTestId('settings-nav-displays'));
      const ambientToggle = screen.getByTestId('settings-ambient-toggle');

      fireEvent.click(ambientToggle);
      expect(useOSStore.getState().desktopMode).toBe('ambient-hero');

      fireEvent.click(ambientToggle);
      expect(useOSStore.getState().desktopMode).toBe('workspace');
    });

    it('navigates to About section and displays system specs', () => {
      render(<SettingsApp />);

      fireEvent.click(screen.getByTestId('settings-nav-about'));
      expect(screen.getByText(/macOS Sonoma Portfolio OS/i)).toBeInTheDocument();
      expect(screen.getByText(/Darwin 24.2.0/i)).toBeInTheDocument();
    });
  });

  /* -------------------------------------------------------------------------- */
  /* 6. MailApp Tests                                                           */
  /* -------------------------------------------------------------------------- */
  describe('MailApp', () => {
    it('renders form fields: Name, Email, Subject, Message, and Send button', () => {
      render(<MailApp />);

      expect(screen.getByTestId('mail-app')).toBeInTheDocument();
      expect(screen.getByTestId('mail-input-name')).toBeInTheDocument();
      expect(screen.getByTestId('mail-input-email')).toBeInTheDocument();
      expect(screen.getByTestId('mail-input-subject')).toBeInTheDocument();
      expect(screen.getByTestId('mail-input-message')).toBeInTheDocument();
      expect(screen.getByTestId('mail-send-button')).toBeInTheDocument();
    });

    it('shows validation errors when submitted empty', () => {
      render(<MailApp />);

      fireEvent.click(screen.getByTestId('mail-send-button'));

      expect(screen.getByText(/Please enter your name/i)).toBeInTheDocument();
      expect(screen.getByText(/Please enter a valid email address/i)).toBeInTheDocument();
      expect(screen.getByText(/Please enter a subject/i)).toBeInTheDocument();
      expect(screen.getByText(/Please provide a message/i)).toBeInTheDocument();
    });

    it('submits valid form, plays flight transition, and renders sent success banner', async () => {
      render(<MailApp />);

      fireEvent.change(screen.getByTestId('mail-input-name'), { target: { value: 'Sarah Connor' } });
      fireEvent.change(screen.getByTestId('mail-input-email'), { target: { value: 'sarah@skynet.ai' } });
      fireEvent.change(screen.getByTestId('mail-input-subject'), { target: { value: 'Engineering Collaboration' } });
      fireEvent.change(screen.getByTestId('mail-input-message'), {
        target: { value: 'We would love to collaborate on the distributed AI agent mesh architecture!' },
      });

      fireEvent.click(screen.getByTestId('mail-send-button'));

      await waitFor(() => {
        expect(screen.getByTestId('mail-sent-success')).toBeInTheDocument();
      }, { timeout: 2000 });

      expect(screen.getByText(/Message Dispatched!/i)).toBeInTheDocument();
    });

    it('copies email to clipboard on copy button click', () => {
      render(<MailApp />);
      const copyBtn = screen.getByTestId('mail-copy-email-btn');

      fireEvent.click(copyBtn);
      expect(screen.getByText(/Copied!/i)).toBeInTheDocument();
    });
  });
});
