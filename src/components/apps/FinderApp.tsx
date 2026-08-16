'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { VFS_FOLDERS, VFS_ITEMS, VFSItem } from '@/data/vfs';
import { useOSStore } from '@/hooks/useOSStore';
import { GlobalAudioManager } from '@/lib/audio/GlobalAudioManager';
import { useVirtualizer } from '@tanstack/react-virtual';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  Search,
  Folder,
  FileText,
  FileCode,
  Image as ImageIcon,
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
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  
  const [dynamicContent, setDynamicContent] = useState<string | null>(null);
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);

  const openWindow = useOSStore(state => state.openWindow);
  
  const parentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const currentFolder = useMemo(() => {
    return VFS_FOLDERS.find(f => f.id === currentFolderId) || VFS_FOLDERS[0];
  }, [currentFolderId]);

  const itemsInCurrentFolder = useMemo(() => {
    return VFS_ITEMS.filter(item => {
      const inFolder = item.parentId === currentFolderId;
      if (!inFolder) return false;
      if (!debouncedSearch) return true;
      return (
        item.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(debouncedSearch.toLowerCase()))
      );
    });
  }, [currentFolderId, debouncedSearch]);

  const selectedItem = useMemo(() => {
    return VFS_ITEMS.find(item => item.id === selectedItemId) || itemsInCurrentFolder[0] || null;
  }, [selectedItemId, itemsInCurrentFolder]);

  useEffect(() => {
    if (selectedItem?.realFilePath && (selectedItem.type === 'document' || selectedItem.type === 'download')) {
      setIsLoadingContent(true);
      setDynamicContent(null);
      fetch(selectedItem.realFilePath)
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch');
          return res.text();
        })
        .then(text => setDynamicContent(text))
        .catch(() => setDynamicContent('Failed to load content.'))
        .finally(() => setIsLoadingContent(false));
    } else {
      setDynamicContent(null);
      setIsLoadingContent(false);
    }
  }, [selectedItem]);

  const rowVirtualizer = useVirtualizer({
    count: itemsInCurrentFolder.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40,
    overscan: 5,
  });

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
    setIsMobileSheetOpen(true);
  };

  const handleItemDoubleClick = (item: VFSItem) => {
    if (item.type === 'app' && item.appId) {
      GlobalAudioManager.getInstance().playFx('window-open');
      openWindow(item.appId);
    } else if (item.type === 'picture' && item.realFilePath) {
      GlobalAudioManager.getInstance().playFx('click');
      setFullScreenImage(item.realFilePath);
    } else if (item.realFilePath) {
      window.open(item.realFilePath, '_blank');
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
        return <ImageIcon className={`${className} text-purple-400`} />;
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

  const previewPaneContent = selectedItem ? (
    <>
      <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-black/40 border border-white/10 shrink-0">
        {selectedItem.type === 'picture' && selectedItem.realFilePath ? (
          <img src={selectedItem.realFilePath} alt={selectedItem.name} className="w-full h-auto rounded-lg mb-3 object-cover max-h-32 shadow-md" />
        ) : (
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-3">
            {renderItemIcon(selectedItem.iconName, 'w-8 h-8')}
          </div>
        )}
        <h4 className="text-xs font-bold text-center text-white break-all">
          {selectedItem.name}
        </h4>
        <span className="text-[10px] text-white/50 mt-0.5 uppercase tracking-wider">
          {selectedItem.type}
        </span>
      </div>

      <div className="space-y-2 text-xs shrink-0 mt-4">
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

      {selectedItem.type === 'app' && selectedItem.developer && (
        <div className="space-y-1.5 text-xs shrink-0 mt-4">
          <div className="text-[10px] font-bold uppercase tracking-wider text-white/40 border-b border-white/10 pb-1">
            App Store Metadata
          </div>
          <div className="flex justify-between">
            <span className="text-white/40">Developer:</span>
            <span className="font-mono text-white/90">{selectedItem.developer}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/40">Rating:</span>
            <span className="font-mono text-white/90">{selectedItem.rating} ⭐ ({selectedItem.reviews})</span>
          </div>
        </div>
      )}

      {(selectedItem.contentPreview || dynamicContent || isLoadingContent) && (
        <div className="space-y-1.5 text-xs flex-1 min-h-0 flex flex-col mt-4">
          <div className="text-[10px] font-bold uppercase tracking-wider text-white/40 border-b border-white/10 pb-1 shrink-0">
            Preview
          </div>
          <div className="bg-black/30 p-2.5 rounded-lg border border-white/10 font-mono text-[11px] text-white/80 overflow-y-auto whitespace-pre-wrap flex-1">
            {isLoadingContent ? 'Loading content...' : (dynamicContent || selectedItem.contentPreview)}
          </div>
        </div>
      )}

      {selectedItem.type === 'app' && selectedItem.appId && (
        <button
          onClick={() => {
            GlobalAudioManager.getInstance().playFx('window-open');
            openWindow(selectedItem.appId!);
          }}
          className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-blue-600/30 transition-all mt-4 shrink-0"
        >
          <Eye size={14} />
          <span>Open Application</span>
        </button>
      )}

      {selectedItem.type === 'picture' && selectedItem.realFilePath && (
        <button
          onClick={() => {
            GlobalAudioManager.getInstance().playFx('click');
            setFullScreenImage(selectedItem.realFilePath!);
          }}
          className="w-full py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-purple-600/30 transition-all mt-4 shrink-0"
        >
          <ImageIcon size={14} />
          <span>View Fullscreen</span>
        </button>
      )}

      {(selectedItem.type === 'document' || selectedItem.type === 'download') && selectedItem.realFilePath && (
        <button
          onClick={() => {
            window.open(selectedItem.realFilePath!, '_blank');
          }}
          className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-emerald-600/30 transition-all mt-4 shrink-0"
        >
          <Eye size={14} />
          <span>Open File</span>
        </button>
      )}
    </>
  ) : null;

  return (
    <div
      data-testid="finder-app"
      className="flex-1 w-full h-full bg-stone-950/90 text-white flex flex-col overflow-hidden select-none relative"
    >
      <div className="h-11 px-3 border-b border-white/10 bg-white/[0.03] flex items-center justify-between gap-3">
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

          <div className="text-xs font-semibold text-white/70 hidden sm:flex items-center space-x-1 pl-1">
            <span className="text-white/40">Macintosh HD</span>
            <span className="text-white/30">&gt;</span>
            <span className="text-white/40">Users</span>
            <span className="text-white/30">&gt;</span>
            <span className="text-white/40">dev</span>
            <span className="text-white/30">&gt;</span>
            <span className="text-white font-bold">{currentFolder.name}</span>
          </div>
          <div className="text-xs font-semibold text-white sm:hidden pl-1">
            {currentFolder.name}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex items-center space-x-0.5 bg-white/5 rounded-lg p-0.5 border border-white/10">
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

          <div className="relative w-32 sm:w-44">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-7 pr-2.5 py-1 bg-white/10 border border-white/10 rounded-lg text-xs text-white placeholder-white/40 outline-none focus:border-blue-500 focus:bg-white/15 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div
          data-testid="finder-sidebar"
          className="hidden md:flex w-44 sm:w-48 border-r border-white/10 bg-white/[0.015] p-2 flex-col space-y-4"
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

        <div className="flex-1 flex flex-col overflow-hidden bg-black/20">
          <div className="flex-1 overflow-y-auto p-4" ref={parentRef}>
            {itemsInCurrentFolder.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-white/40">
                No items match your search
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
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
              <div className="w-full text-xs">
                <div className="grid grid-cols-12 pb-2 mb-2 border-b border-white/10 text-[11px] font-semibold text-white/40 uppercase tracking-wider px-2 sticky top-0 bg-stone-950/90 z-10 backdrop-blur-md">
                  <div className="col-span-6">Name</div>
                  <div className="col-span-3">Date Modified</div>
                  <div className="col-span-2">Size</div>
                  <div className="col-span-1">Kind</div>
                </div>
                <div
                  style={{
                    height: `${rowVirtualizer.getTotalSize()}px`,
                    width: '100%',
                    position: 'relative',
                  }}
                >
                  {rowVirtualizer.getVirtualItems().map(virtualItem => {
                    const item = itemsInCurrentFolder[virtualItem.index];
                    const isSelected = selectedItem?.id === item.id;
                    return (
                      <div
                        key={item.id}
                        data-testid={`finder-item-${item.id}`}
                        onClick={() => handleItemClick(item)}
                        onDoubleClick={() => handleItemDoubleClick(item)}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: `${virtualItem.size}px`,
                          transform: `translateY(${virtualItem.start}px)`,
                        }}
                        className={`grid grid-cols-12 items-center px-2 cursor-pointer transition-all ${
                          isSelected ? 'bg-blue-600 text-white font-medium rounded-lg' : 'hover:bg-white/5 text-white/80 rounded-lg'
                        }`}
                      >
                        <div className="col-span-6 flex items-center space-x-2 truncate pr-2">
                          {renderItemIcon(item.iconName, 'w-4 h-4 shrink-0')}
                          <span className="truncate">{item.name}</span>
                        </div>
                        <div className="col-span-3 text-white/50 text-[11px] font-mono truncate pr-2">
                          {item.modified}
                        </div>
                        <div className="col-span-2 text-white/50 text-[11px] font-mono truncate pr-2">
                          {item.size}
                        </div>
                        <div className="col-span-1 text-white/40 text-[10px] uppercase truncate">
                          {item.type}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="h-6 px-3 border-t border-white/10 bg-white/[0.02] flex items-center justify-between text-[11px] text-white/40 font-mono shrink-0">
            <span>{itemsInCurrentFolder.length} items</span>
            <span>482.4 GB available</span>
          </div>
        </div>

        {selectedItem && (
          <div
            data-testid="finder-preview-pane"
            className="hidden md:flex w-56 sm:w-64 border-l border-white/10 bg-white/[0.02] p-4 flex-col overflow-y-auto"
          >
            {previewPaneContent}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedItem && isMobileSheetOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 z-40 md:hidden"
              onClick={() => setIsMobileSheetOpen(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="absolute bottom-0 left-0 right-0 h-[75vh] bg-stone-900 border-t border-white/10 z-50 rounded-t-3xl p-6 md:hidden flex flex-col overflow-hidden shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
            >
              <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-4 shrink-0 cursor-pointer" onClick={() => setIsMobileSheetOpen(false)} />
              <div className="flex-1 overflow-y-auto pb-6 flex flex-col">
                {previewPaneContent}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {fullScreenImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 z-[60] bg-black/80 flex flex-col backdrop-blur-md cursor-pointer"
            onClick={() => setFullScreenImage(null)}
          >
            <div className="flex justify-end p-4 shrink-0">
               <button 
                 onClick={(e) => { e.stopPropagation(); setFullScreenImage(null); }} 
                 className="px-4 py-1.5 bg-white/10 hover:bg-white/20 rounded-full text-white text-xs font-semibold transition-colors"
               >
                  Close
               </button>
            </div>
            <div className="flex-1 flex items-center justify-center p-2 sm:p-6 min-h-0">
               <img src={fullScreenImage} className="max-w-full max-h-full object-contain shadow-2xl rounded-lg border border-white/10" alt="Fullscreen View" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
