// jest.setup.js
require('@testing-library/jest-dom');

// Polyfill for TextEncoder/TextDecoder which is needed for React Router v6
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// For some MUI components that use this
Object.defineProperty(window, 'scrollTo', { value: jest.fn(), writable: true });