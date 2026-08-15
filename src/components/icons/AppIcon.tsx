import React from 'react';
import { TerminalIcon } from './TerminalIcon';
import { ProjectsIcon } from './ProjectsIcon';
import { AboutIcon } from './AboutIcon';
import { FinderIcon } from './FinderIcon';
import { SettingsIcon } from './SettingsIcon';
import { MailIcon } from './MailIcon';
import * as LucideIcons from 'lucide-react';

export const APP_ICONS: Record<string, React.FC<{ className?: string; size?: number }>> = {
  terminal: TerminalIcon,
  projects: ProjectsIcon,
  about: AboutIcon,
  finder: FinderIcon,
  settings: SettingsIcon,
  mail: MailIcon,
};

export interface AppIconProps {
  appId: string;
  iconName?: string;
  className?: string;
  size?: number;
}

export const AppIcon: React.FC<AppIconProps> = ({
  appId,
  iconName,
  className = 'w-full h-full',
  size,
}) => {
  const IconComponent = APP_ICONS[appId.toLowerCase()];
  if (IconComponent) {
    return <IconComponent className={className} size={size} />;
  }

  const LucideMap = LucideIcons as unknown as Record<
    string,
    React.ComponentType<{ className?: string }>
  >;
  const FallbackLucide = (iconName && LucideMap[iconName]) || LucideIcons.AppWindow;
  return <FallbackLucide className={className} />;
};
