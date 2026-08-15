import React, { useRef } from 'react';
import { AppId } from '../../types/os';
import {
  FolderGit2,
  Terminal,
  User,
  Folder,
  Settings,
  Music,
  FileText,
  LucideIcon,
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  FolderGit2,
  Terminal,
  User,
  Folder,
  Settings,
  Music,
  FileText,
};

interface DesktopIconProps {
  id: AppId;
  title: string;
  icon: string;
  isSelected: boolean;
  onSelect: (id: AppId) => void;
  onOpen: (id: AppId) => void;
}

export const DesktopIcon: React.FC<DesktopIconProps> = ({
  id,
  title,
  icon,
  isSelected,
  onSelect,
  onOpen,
}) => {
  const clickTimeoutRef = useRef<number | null>(null);
  const IconComponent = ICON_MAP[icon] || Folder;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (clickTimeoutRef.current) {
      // Double click detected!
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
      onOpen(id);
    } else {
      // Single click
      onSelect(id);
      clickTimeoutRef.current = window.setTimeout(() => {
        clickTimeoutRef.current = null;
      }, 300);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`group flex flex-col items-center justify-center w-[92px] h-[104px] p-2 rounded-lg cursor-pointer transition-all ${
        isSelected
          ? 'bg-primary/30 border border-primary/50 shadow-md backdrop-blur-sm'
          : 'hover:bg-white/10 border border-transparent'
      }`}
      role="button"
      aria-label={`Open ${title}`}
    >
      {/* Icon Graphic */}
      <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-b from-white/15 to-white/5 border border-white/15 shadow-md group-hover:scale-105 transition-transform text-white">
        <IconComponent className="w-7 h-7 text-primary-dark drop-shadow" />
      </div>

      {/* Label */}
      <span
        className={`text-[12px] font-medium text-center mt-1.5 px-1.5 py-0.5 rounded leading-tight max-w-[84px] truncate ${
          isSelected
            ? 'bg-primary text-white font-semibold'
            : 'text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]'
        }`}
      >
        {title}
      </span>
    </div>
  );
};
