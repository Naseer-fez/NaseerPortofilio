'use client';

import React, { useState, useMemo } from 'react';
import { VFS_FOLDERS, VFS_ITEMS, VFSItem } from '@/data/vfs';
import { useOSStore } from '@/hooks/useOSStore';
import { GlobalAudioManager } from '@/lib/audio/GlobalAudioManager';
import {
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  Search,
  Folder,
  FileText,
  FileCode,
  Image,
  Archive,
  Binary,
  AppWindow,
  Download,
  Eye,
  Info,
} from 'lucide-react';

export function FinderApp() {
  const [currentFolderId, setCurrentFolderId] = useState<string>('apps');
  const [history, setHistory] = useState<string[]>(['apps']);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const openWindow = useOSStore(state => state.openWindow);

  const currentFolder = useMemo(() => {
    return VFS_FOLDERS.find(f => f.id === currentFolderId) || VFS_FOLDERS[0];
  }, [currentFolderId]);

  const itemsInCurrentFolder = useMemo(() => {
    return VFS_ITEMS.filter(item => {
      const inFolder = item.parentId === currentFolderId;
      if (!inFolder) return false;
      if (!searchQuery) return true;
      return (
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    });
  }, [currentFolderId, searchQuery]);

  const selectedItem = useMemo(() => {
    return VFS_ITEMS.find(item => item.id === selectedItemId) || itemsInCurrentFolder[0] || null;
  }, [selectedItemId, itemsInCurrentFolder]);

  const navigateToFolder = (folderId: string) => {
    GlobalAudioManager.getInstance().playFx('click');
    if (folderId === currentFolderId) return;

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(folderId);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setCurrentFolderId(folderId);
    setSelectedItemId(null);
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      GlobalAudioManager.getInstance().playFx('click');
      const prev = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setCurrentFolderId(prev);
      setSelectedItemId(null);
    }
  };

  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      GlobalAudioManager.getInstance().playFx('click');
      const next = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setCurrentFolderId(next);
      setSelectedItemId(null);
    }
  };

  const handleItemClick = (item: VFSItem) => {
    GlobalAudioManager.getInstance().playFx('click');
    setSelectedItemId(item.id);
  };

  const handleItemDoubleClick = (item: VFSItem) => {
    if (item.type === 'app' && item.appId) {
      GlobalAudioManager.getInstance().playFx('window-open');
      openWindow(item.appId);
    }
  };

  const renderItemIcon = (iconName: string, className = 'w-5 h-5') => {
    switch (iconName) {
      case 'Folder':
        return <Folder className={`${className} text-sky-400`} />;
      case 'FileText':
        return <FileText className={`${className} text-rose-400`} />;
      case 'FileCode':
        return <FileCode className={`${className} text-emerald-400`} />;
      case 'Image':
        return <Image className={`${className} text-purple-400`} />;
      case 'Archive':
        return <Archive className={`${className} text-amber-400`} />;
      case 'Binary':
        return <Binary className={`${className} text-cyan-400`} />;
      case 'AppWindow':
      case 'Terminal':
      case 'Briefcase':
      case 'User':
      case 'Settings':
      case 'Mail':
        return <AppWindow className={`${className} text-blue-400`} />;
      default:
        return <FileText className={`${className} text-white/70`} />;
    }
  };

  return (
    <div
      data-testid="finder-app"
      className="flex-1 w-full h-full bg-stone-950/90 text-white flex flex-col overflow-hidden select-none"
    >
      {/* Finder Chrome Toolbar */}
      <div className="h-11 px-3 border-b border-white/10 bg-white/[0.03] flex items-center justify-between gap-3">
        {/* Navigation & Breadcrumbs */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-0.5 bg-white/5 rounded-lg p-0.5 border border-white/10">
            <button
              onClick={handleBack}
              disabled={historyIndex === 0}
              aria-label="Back"
              className={`p-1 rounded hover:bg-white/10 transition-colors ${
                historyIndex === 0 ? 'text-white/20' : 'text-white/80'
              }`}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={handleForward}
              disabled={historyIndex >= history.length - 1}
              aria-label="Forward"
              className={`p-1 rounded hover:bg-white/10 transition-colors ${
                historyIndex >= history.length - 1 ? 'text-white/20' : 'text-white/80'
              }`}
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Breadcrumb Path */}
          <div className="text-xs font-semibold text-white/70 flex items-center space-x-1 pl-1">
            <span className="text-white/40">Macintosh HD</span>
            <span className="text-white/30">&gt;</span>
            <span className="text-white/40">Users</span>
            <span className="text-white/30">&gt;</span>
            <span className="text-white/40">dev</span>
            <span className="text-white/30">&gt;</span>
            <span className="text-white font-bold">{currentFolder.name}</span>
          </div>
        </div>

        {/* View Mode Toggle & Search */}
        <div className="flex items-center space-x-3">
          {/* Grid / List View Toggle */}
          <div className="flex items-center space-x-0.5 bg-white/5 rounded-lg p-0.5 border border-white/10">
            <button
              data-testid="finder-view-grid-btn"
              onClick={() => {
                GlobalAudioManager.getInstance().playFx('click');
                setViewMode('grid');
              }}
              aria-label="Grid View"
              className={`p-1 rounded transition-colors ${
                viewMode === 'grid' ? 'bg-blue-600 text-white shadow-sm' : 'text-white/60 hover:text-white'
              }`}
            >
              <LayoutGrid size={14} />
            </button>
            <button
              data-testid="finder-view-list-btn"
              onClick={() => {
                GlobalAudioManager.getInstance().playFx('click');
                setViewMode('list');
              }}
              aria-label="List View"
              className={`p-1 rounded transition-colors ${
                viewMode === 'list' ? 'bg-blue-600 text-white shadow-sm' : 'text-white/60 hover:text-white'
              }`}
            >
              <List size={14} />
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-36 sm:w-44">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Search folder"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-7 pr-2.5 py-1 bg-white/10 border border-white/10 rounded-lg text-xs text-white placeholder-white/40 outline-none focus:border-blue-500 focus:bg-white/15 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Main Dual-Pane Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <div
          data-testid="finder-sidebar"
          className="w-44 sm:w-48 border-r border-white/10 bg-white/[0.015] p-2 flex flex-col space-y-4"
        >
          <div>
            <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white/40">
              Favorites
            </div>
            <div className="space-y-0.5 mt-1">
              {VFS_FOLDERS.map(folder => {
                const isActive = currentFolderId === folder.id;
                return (
                  <button
                    key={folder.id}
                    data-testid={`finder-sidebar-${folder.id}`}
                    onClick={() => navigateToFolder(folder.id)}
                    className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white font-semibold shadow-sm'
                        : 'text-white/70 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {renderItemIcon(folder.iconName, 'w-4 h-4')}
                    <span>{folder.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white/40">
              Locations
            </div>
            <div className="space-y-0.5 mt-1">
              <div className="flex items-center space-x-2 px-2.5 py-1.5 text-xs text-white/50">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Macintosh HD</span>
              </div>
              <div className="flex items-center space-x-2 px-2.5 py-1.5 text-xs text-white/50">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>GitHub Cloud</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Main Item Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-black/20">
          <div className="flex-1 overflow-y-auto p-4">
            {itemsInCurrentFolder.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-white/40">
                No items in this folder
              </div>
            ) : viewMode === 'grid' ? (
              /* GRID VIEW */
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {itemsInCurrentFolder.map(item => {
                  const isSelected = selectedItem?.id === item.id;
                  return (
                    <div
                      key={item.id}
                      data-testid={`finder-item-${item.id}`}
                      onClick={() => handleItemClick(item)}
                      onDoubleClick={() => handleItemDoubleClick(item)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-blue-600/30 border border-blue-500/50 shadow-md'
                          : 'hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-2 shadow-sm">
                        {renderItemIcon(item.iconName, 'w-6 h-6')}
                      </div>
                      <span className="text-xs font-medium text-center text-white/90 line-clamp-2 break-all">
                        {item.name}
                      </span>
                      <span className="text-[10px] text-white/40 font-mono mt-0.5">
                        {item.size}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* LIST VIEW */
              <div className="w-full text-xs">
                <div className="grid grid-cols-12 pb-2 mb-2 border-b border-white/10 text-[11px] font-semibold text-white/40 uppercase tracking-wider px-2">
                  <div className="col-span-6">Name</div>
                  <div className="col-span-3">Date Modified</div>
                  <div className="col-span-2">Size</div>
                  <div className="col-span-1">Kind</div>
                </div>
                <div className="space-y-0.5">
                  {itemsInCurrentFolder.map(item => {
                    const isSelected = selectedItem?.id === item.id;
                    return (
                      <div
                        key={item.id}
                        data-testid={`finder-item-${item.id}`}
                        onClick={() => handleItemClick(item)}
                        onDoubleClick={() => handleItemDoubleClick(item)}
                        className={`grid grid-cols-12 items-center px-2 py-1.5 rounded-lg cursor-pointer transition-all ${
                          isSelected ? 'bg-blue-600 text-white font-medium' : 'hover:bg-white/5 text-white/80'
                        }`}
                      >
                        <div className="col-span-6 flex items-center space-x-2 truncate">
                          {renderItemIcon(item.iconName, 'w-4 h-4')}
                          <span className="truncate">{item.name}</span>
                        </div>
                        <div className="col-span-3 text-white/50 text-[11px] font-mono">
                          {item.modified}
                        </div>
                        <div className="col-span-2 text-white/50 text-[11px] font-mono">
                          {item.size}
                        </div>
                        <div className="col-span-1 text-white/40 text-[10px] uppercase">
                          {item.type}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Status Bar */}
          <div className="h-6 px-3 border-t border-white/10 bg-white/[0.02] flex items-center justify-between text-[11px] text-white/40 font-mono">
            <span>{itemsInCurrentFolder.length} items</span>
            <span>482.4 GB available</span>
          </div>
        </div>

        {/* Right Preview Inspector Pane */}
        {selectedItem && (
          <div
            data-testid="finder-preview-pane"
            className="w-56 sm:w-64 border-l border-white/10 bg-white/[0.02] p-4 flex flex-col space-y-4 overflow-y-auto"
          >
            {/* Preview Thumbnail */}
            <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-black/40 border border-white/10">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-3">
                {renderItemIcon(selectedItem.iconName, 'w-8 h-8')}
              </div>
              <h4 className="text-xs font-bold text-center text-white break-all">
                {selectedItem.name}
              </h4>
              <span className="text-[10px] text-white/50 mt-0.5 uppercase tracking-wider">
                {selectedItem.type}
              </span>
            </div>

            {/* Metadata Inspector */}
            <div className="space-y-2 text-xs">
              <div className="text-[10px] font-bold uppercase tracking-wider text-white/40 border-b border-white/10 pb-1">
                Information
              </div>
              <div className="space-y-1.5 text-xs text-white/70">
                <div className="flex justify-between">
                  <span className="text-white/40">Size:</span>
                  <span className="font-mono text-white/90">{selectedItem.size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Modified:</span>
                  <span className="font-mono text-white/90">{selectedItem.modified}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Kind:</span>
                  <span className="capitalize text-white/90">{selectedItem.type}</span>
                </div>
              </div>
            </div>

            {/* Content Preview Snippet */}
            {selectedItem.contentPreview && (
              <div className="space-y-1.5 text-xs flex-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-white/40 border-b border-white/10 pb-1">
                  Preview
                </div>
                <div className="bg-black/30 p-2.5 rounded-lg border border-white/10 font-mono text-[11px] text-white/80 max-h-36 overflow-y-auto whitespace-pre-wrap">
                  {selectedItem.contentPreview}
                </div>
              </div>
            )}

            {/* Quick Action Button */}
            {selectedItem.type === 'app' && selectedItem.appId && (
              <button
                onClick={() => {
                  GlobalAudioManager.getInstance().playFx('window-open');
                  openWindow(selectedItem.appId!);
                }}
                className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-blue-600/30 transition-all mt-auto"
              >
                <Eye size={14} />
                <span>Open Application</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
