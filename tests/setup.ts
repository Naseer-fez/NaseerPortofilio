import '@testing-library/jest-dom/vitest';
import { beforeEach, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Import Browser API Mocks
import { installWebAudioMock, resetWebAudioMock } from './mocks/audio/AudioContextMock';
import { installHTMLAudioMock, resetHTMLAudioMock } from './mocks/audio/HTMLAudioElementMock';
import { installCanvas2DMock } from './mocks/dom/Canvas2DMock';
import { installResizeObserverMock, resetResizeObserverMock } from './mocks/dom/ResizeObserverMock';
import { installMatchMediaMock, resetMatchMediaMock } from './mocks/dom/MatchMediaMock';
import { installIntersectionObserverMock } from './mocks/dom/IntersectionObserverMock';
import { installPointerEventsMock } from './mocks/dom/PointerEventsMock';
import { installLocalStorageMock, resetLocalStorageMock } from './mocks/dom/LocalStorageMock';
import { installMediaSessionMock, resetMediaSessionMock } from './mocks/platform/MediaSessionMock';
import { installDeviceOrientationMock } from './mocks/platform/DeviceOrientationMock';
import { installRafMock, resetRafMock } from './mocks/dom/RafMock';

// Register Custom Matchers
import './helpers/matchers';

// Install all global browser mocks
installWebAudioMock();
installHTMLAudioMock();
installCanvas2DMock();
installResizeObserverMock();
installMatchMediaMock();
installIntersectionObserverMock();
installPointerEventsMock();
installLocalStorageMock();
installMediaSessionMock();
installDeviceOrientationMock();
installRafMock();

beforeEach(() => {
  resetWebAudioMock();
  installWebAudioMock();
  resetHTMLAudioMock();
  installHTMLAudioMock();
  resetResizeObserverMock();
  resetMatchMediaMock();
  resetLocalStorageMock();
  resetMediaSessionMock();
  resetRafMock();
  vi.clearAllMocks();
});

afterEach(() => {
  cleanup();
});
